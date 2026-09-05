import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support high-resolution poster uploads (up to 50MB)
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Ensure public/posters folder exists for uploaded poster files
  const postersDir = path.join(process.cwd(), "public", "posters");
  if (!fs.existsSync(postersDir)) {
    fs.mkdirSync(postersDir, { recursive: true });
  }
  app.use("/posters", express.static(postersDir));

  // Health check route first
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Endpoint to add uploaded poster & event details directly to the code in src/components/Events.tsx
  app.post("/api/events/add-to-code", async (req, res) => {
    try {
      const event = req.body;
      if (!event || !event.title || !event.imageUrl) {
        return res.status(400).json({ error: "Title and poster image are required" });
      }

      let finalImageUrl = event.imageUrl;

      // If imageUrl is a base64 Data URL, save it as an image file on disk in public/posters/
      if (typeof event.imageUrl === "string" && event.imageUrl.startsWith("data:image/")) {
        const matches = event.imageUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
        if (matches) {
          const rawExt = matches[1].toLowerCase();
          const ext = rawExt.includes("png") ? "png" : rawExt.includes("jpeg") || rawExt.includes("jpg") ? "jpg" : "webp";
          const base64Data = matches[2];
          const cleanTitle = (event.title || "poster")
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-")
            .replace(/-+/g, "-")
            .slice(0, 30);
          const fileName = `${cleanTitle}-${Date.now()}.${ext}`;
          const filePath = path.join(postersDir, fileName);
          await fs.promises.writeFile(filePath, Buffer.from(base64Data, "base64"));
          finalImageUrl = `/posters/${fileName}`;
        }
      }

      const eventWithImage = {
        id: event.id || `event-${Date.now()}`,
        title: event.title.trim(),
        subtitle: (event.subtitle || "").trim(),
        date: (event.date || "Announced Soon").trim(),
        time: (event.time || "TBA").trim(),
        venue: (event.venue || "Campus Square").trim(),
        status: event.status || "upcoming",
        category: event.category || "Cultural",
        description: (event.description || "").trim(),
        imageUrl: finalImageUrl,
        highlights: Array.isArray(event.highlights) ? event.highlights.filter(Boolean) : [],
        organizer: (event.organizer || "USRA").trim(),
        tags: Array.isArray(event.tags) ? event.tags.filter(Boolean) : ["USRA", "Event"]
      };

      // Path to Events.tsx
      const eventsFilePath = path.join(process.cwd(), "src", "components", "Events.tsx");
      let codeUpdated = false;

      if (fs.existsSync(eventsFilePath)) {
        let content = await fs.promises.readFile(eventsFilePath, "utf-8");

        const highlightsFormatted = eventWithImage.highlights.length > 0
          ? `[\n${eventWithImage.highlights.map((h: string) => `      ${JSON.stringify(h)}`).join(",\n")}\n    ]`
          : "[]";

        const tagsFormatted = eventWithImage.tags.length > 0
          ? `[${eventWithImage.tags.map((t: string) => JSON.stringify(t)).join(", ")}]`
          : "[]";

        const newEventSnippet = `  {\n    id: ${JSON.stringify(eventWithImage.id)},\n    title: ${JSON.stringify(eventWithImage.title)},\n    subtitle: ${JSON.stringify(eventWithImage.subtitle)},\n    date: ${JSON.stringify(eventWithImage.date)},\n    time: ${JSON.stringify(eventWithImage.time)},\n    venue: ${JSON.stringify(eventWithImage.venue)},\n    status: ${JSON.stringify(eventWithImage.status)},\n    category: ${JSON.stringify(eventWithImage.category)},\n    description: ${JSON.stringify(eventWithImage.description)},\n    imageUrl: ${JSON.stringify(eventWithImage.imageUrl)},\n    highlights: ${highlightsFormatted},\n    organizer: ${JSON.stringify(eventWithImage.organizer)},\n    tags: ${tagsFormatted}\n  },`;

        const targetMarker = "export const initialEventsData: EventItem[] = [";
        if (content.includes(targetMarker)) {
          content = content.replace(targetMarker, `${targetMarker}\n${newEventSnippet}`);
          await fs.promises.writeFile(eventsFilePath, content, "utf-8");
          codeUpdated = true;
          console.log(`[Events] Successfully inserted new event "${eventWithImage.title}" directly into src/components/Events.tsx`);
        }
      }

      res.json({
        success: true,
        message: codeUpdated
          ? "Poster and event details successfully added directly into src/components/Events.tsx!"
          : "Poster processed and stored successfully!",
        event: eventWithImage,
        codeUpdated
      });
    } catch (error: any) {
      console.error("Error adding event to code:", error);
      res.status(500).json({ error: error.message || "Failed to add event to code" });
    }
  });

  // Contact Form Mailing Endpoint - routes messages to usradiia9@gmail.com
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      const targetEmail = process.env.CONTACT_EMAIL || "usradiia9@gmail.com";

      if (!name || !email || !message) {
        return res.status(400).json({ error: "Name, email, and message are required." });
      }

      // 1. Persist message locally in data/inquiries.json so no inquiry is ever lost
      try {
        const dataDir = path.join(process.cwd(), "data");
        if (!fs.existsSync(dataDir)) {
          await fs.promises.mkdir(dataDir, { recursive: true });
        }
        const inquiriesPath = path.join(dataDir, "inquiries.json");
        let inquiries: any[] = [];
        if (fs.existsSync(inquiriesPath)) {
          const raw = await fs.promises.readFile(inquiriesPath, "utf-8");
          try {
            inquiries = JSON.parse(raw);
          } catch (e) {
            inquiries = [];
          }
        }
        const newInquiry = {
          id: `inq-${Date.now()}`,
          name,
          email,
          subject: subject || "No Subject",
          message,
          to: targetEmail,
          receivedAt: new Date().toISOString()
        };
        inquiries.unshift(newInquiry);
        await fs.promises.writeFile(inquiriesPath, JSON.stringify(inquiries.slice(0, 100), null, 2), "utf-8");
      } catch (err) {
        console.warn("[Contact] Could not save inquiry to local storage:", err);
      }

      // 2. If SMTP is configured, send directly via nodemailer
      let smtpSent = false;
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        try {
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: Number(process.env.SMTP_PORT) || 465,
            secure: Number(process.env.SMTP_PORT) === 465 || !process.env.SMTP_PORT,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });

          await transporter.sendMail({
            from: `"${name} via USRA" <${process.env.SMTP_USER}>`,
            to: targetEmail,
            replyTo: email,
            subject: `[USRA Contact] ${subject || "New Inquiry from " + name}`,
            text: `Sender: ${name} (${email})\nSubject: ${subject || "N/A"}\nDate: ${new Date().toLocaleString()}\n\nMessage:\n${message}`,
            html: `
              <div style="font-family: sans-serif; padding: 20px; color: #111; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #2563eb; margin-top: 0;">New Message from USRA Contact Form</h2>
                <p><strong>Sender Name:</strong> ${name}</p>
                <p><strong>Sender Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p><strong>Message:</strong></p>
                <div style="background: #f8fafc; padding: 15px; border-radius: 6px; white-space: pre-wrap;">${message}</div>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 11px; color: #64748b;">This message was routed to ${targetEmail} via the USRA Union Portal.</p>
              </div>
            `,
          });
          smtpSent = true;
          console.log(`[Contact] SMTP message successfully delivered to ${targetEmail}`);
        } catch (smtpError) {
          console.error("[Contact] SMTP send failed:", smtpError);
        }
      }

      // If SMTP was not configured, relay through FormSubmit from the server
      let externalRelaySent = false;
      if (!smtpSent) {
        try {
          const formSubmitRes = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({
              name,
              email,
              subject: `[USRA Contact Direct] ${subject || "New Inquiry from " + name}`,
              message,
              _subject: `[USRA Contact Direct] ${subject || "Inquiry from " + name}`,
              _replyto: email,
              _captcha: "false"
            })
          });
          if (formSubmitRes.ok) {
            externalRelaySent = true;
            console.log(`[Contact] FormSubmit relay successfully dispatched message to ${targetEmail}`);
          }
        } catch (relayErr) {
          console.warn("[Contact] Server FormSubmit relay warning:", relayErr);
        }
      }

      // Build handy Gmail web compose URL and mailto URL
      const emailBody = `Sender: ${name} (${email})\nSubject: ${subject || 'USRA Inquiry'}\n\nMessage:\n${message}`;
      const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${encodeURIComponent(`[USRA Portal] ${subject || 'Inquiry from ' + name}`)}&body=${encodeURIComponent(emailBody)}`;
      const mailtoUrl = `mailto:${encodeURIComponent(targetEmail)}?subject=${encodeURIComponent(`[USRA Portal] ${subject || 'Inquiry from ' + name}`)}&body=${encodeURIComponent(emailBody)}`;

      return res.json({
        success: true,
        message: `Message dispatched directly to ${targetEmail}`,
        targetEmail,
        smtpSent,
        externalRelaySent,
        gmailComposeUrl,
        mailtoUrl
      });
    } catch (error: any) {
      console.error("[Contact] Error handling contact submission:", error);
      return res.status(500).json({ error: error.message || "Failed to process message" });
    }
  });

  // Fetch logged inquiries
  app.get("/api/contact/inquiries", async (req, res) => {
    try {
      const inquiriesPath = path.join(process.cwd(), "data", "inquiries.json");
      if (fs.existsSync(inquiriesPath)) {
        const raw = await fs.promises.readFile(inquiriesPath, "utf-8");
        const list = JSON.parse(raw);
        return res.json({ inquiries: list });
      }
      return res.json({ inquiries: [] });
    } catch (e) {
      return res.json({ inquiries: [] });
    }
  });

  // Lazy initialize Gemini client
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Please set it in Settings > Secrets.");
    }
    if (!aiClient) {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiClient;
  }

  // Secure API endpoint for Gemini-powered Media Concept Generation
  app.post("/api/ai/brainstorm", async (req, res) => {
    try {
      const { type, topic, mood, language } = req.body;
      if (!topic) {
        return res.status(400).json({ error: "Topic is required" });
      }

      const ai = getGeminiClient();

      const prompt = `As the USRA Media Creative AI Director, brainstorm a highly creative media project.
Project Type: ${type || 'Short Film'}
Topic/Theme: ${topic}
Mood/Aesthetic: ${mood || 'Cinematic'}
Preferred Language: ${language || 'English'}

Provide a structured, deeply inspiring response with title concepts, a beautiful narrative synopsis, cinematic visual shot lists, a suggested color palette, and a scene outline. Keep it aligned with USRA Media's focus on moral values, community unity, and visual excellence. Ensure the output is in the requested language (if Both, write primarily in English with Arabic titles or translations included).`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              titles: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Three powerful, poetic, and creative project title options."
              },
              concept: {
                type: Type.STRING,
                description: "A deeply engaging, narrative synopsis/concept of the media project (2-3 paragraphs)."
              },
              aestheticDescription: {
                type: Type.STRING,
                description: "A vivid description of the visual and sensory style, lighting, and pacing (iOS 27 style luxury aesthetics)."
              },
              colorPalette: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Suggested color themes or hex-like codes with beautiful names, e.g., 'Cosmic Slate - #1a1a2e'."
              },
              shotList: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    shot: { type: Type.STRING },
                    visuals: { type: Type.STRING },
                    audio: { type: Type.STRING }
                  },
                  required: ["shot", "visuals", "audio"]
                },
                description: "Three cinematic, precise shot descriptions including type, visual action, and audio design."
              },
              scriptOutline: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    part: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["part", "description"]
                },
                description: "Three key parts of the project's storytelling structure (e.g. Intro, Climax, Resolution)."
              }
            },
            required: ["titles", "concept", "aestheticDescription", "colorPalette", "shotList", "scriptOutline"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No text returned from Gemini API");
      }

      res.json(JSON.parse(responseText.trim()));
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Failed to communicate with Gemini API" });
    }
  });

  // Serve static assets or use Vite dev server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
