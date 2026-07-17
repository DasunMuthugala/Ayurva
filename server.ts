import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { 
  initDB, 
  StudentModel, 
  PaymentModel, 
  AttendanceModel, 
  ClassScheduleModel, 
  InquiryModel, 
  TrialClassModel, 
  ExpenseModel, 
  AuditLogModel, 
  BusinessSettingsModel 
} from "./src/db/mongo.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json());

  // Connect to MongoDB
  try {
    await initDB();
  } catch (dbErr) {
    console.error("[MongoDB] Initial connection failure:", dbErr);
  }

  // --- MongoDB API Routes ---

  // Students
  app.get("/api/students", async (req, res) => {
    try {
      const docs = await StudentModel.find({}).sort({ registrationDate: -1 });
      res.json(docs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/students", async (req, res) => {
    try {
      const studentData = req.body;
      const existing = await StudentModel.findOne({ id: studentData.id });
      if (existing) {
        Object.assign(existing, studentData);
        await existing.save();
        res.json(existing);
      } else {
        const doc = new StudentModel(studentData);
        await doc.save();
        res.status(201).json(doc);
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/students/:id", async (req, res) => {
    try {
      const doc = await StudentModel.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
      res.json(doc);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/students/:id", async (req, res) => {
    try {
      await StudentModel.deleteOne({ id: req.params.id });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Payments
  app.get("/api/payments", async (req, res) => {
    try {
      const docs = await PaymentModel.find({}).sort({ date: -1 });
      res.json(docs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/payments", async (req, res) => {
    try {
      const doc = new PaymentModel(req.body);
      await doc.save();
      res.status(201).json(doc);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Attendance
  app.get("/api/attendance", async (req, res) => {
    try {
      const docs = await AttendanceModel.find({}).sort({ date: -1 });
      res.json(docs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/attendance", async (req, res) => {
    try {
      const doc = new AttendanceModel(req.body);
      await doc.save();
      res.status(201).json(doc);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/attendance/:id", async (req, res) => {
    try {
      const doc = await AttendanceModel.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
      res.json(doc);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Classes
  app.get("/api/classes", async (req, res) => {
    try {
      const docs = await ClassScheduleModel.find({});
      res.json(docs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/classes", async (req, res) => {
    try {
      const doc = new ClassScheduleModel(req.body);
      await doc.save();
      res.status(201).json(doc);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/classes/:id", async (req, res) => {
    try {
      await ClassScheduleModel.deleteOne({ id: req.params.id });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Inquiries
  app.get("/api/inquiries", async (req, res) => {
    try {
      const docs = await InquiryModel.find({}).sort({ date: -1 });
      res.json(docs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/inquiries", async (req, res) => {
    try {
      const doc = new InquiryModel(req.body);
      await doc.save();
      res.status(201).json(doc);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/inquiries/:id", async (req, res) => {
    try {
      const doc = await InquiryModel.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
      res.json(doc);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Trials
  app.get("/api/trials", async (req, res) => {
    try {
      const docs = await TrialClassModel.find({}).sort({ date: -1 });
      res.json(docs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/trials", async (req, res) => {
    try {
      const doc = new TrialClassModel(req.body);
      await doc.save();
      res.status(201).json(doc);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Expenses
  app.get("/api/expenses", async (req, res) => {
    try {
      const docs = await ExpenseModel.find({}).sort({ date: -1 });
      res.json(docs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/expenses", async (req, res) => {
    try {
      const doc = new ExpenseModel(req.body);
      await doc.save();
      res.status(201).json(doc);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Audit Logs
  app.get("/api/auditLogs", async (req, res) => {
    try {
      const docs = await AuditLogModel.find({}).sort({ timestamp: -1 });
      res.json(docs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/auditLogs", async (req, res) => {
    try {
      const doc = new AuditLogModel(req.body);
      await doc.save();
      res.status(201).json(doc);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/auditLogs", async (req, res) => {
    try {
      await AuditLogModel.deleteMany({});
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Business Settings
  app.get("/api/businessSettings", async (req, res) => {
    try {
      const doc = await BusinessSettingsModel.findOne({});
      res.json(doc);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/businessSettings", async (req, res) => {
    try {
      let doc = await BusinessSettingsModel.findOne({});
      if (doc) {
        Object.assign(doc, req.body);
        await doc.save();
      } else {
        doc = new BusinessSettingsModel(req.body);
        await doc.save();
      }
      res.json(doc);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Server-side Gemini API Endpoint for Student AI Analysis & recommendations
  app.post("/api/gemini/student-ai-analysis", async (req: express.Request, res: express.Response) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: "GEMINI_API_KEY is not configured on the server. Please define it in your environment or Secrets panel." 
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      const { student } = req.body;
      if (!student) {
        return res.status(400).json({ error: "Student parameter is missing." });
      }

      const prompt = `You are an expert yoga therapist and senior instructor at "Ayurva Yoga & Wellness".
Analyze the following student profile, goals, lifestyle, and health scores to generate a clinical-grade yet warm and encouraging yoga wellness plan.

Student Profile:
- Name: ${student.fullName}
- Age: ${student.age}, Gender: ${student.gender}
- Goals: ${student.goals}
- Yoga Experience: ${student.yogaExperience || "None"}
- Medical Conditions: ${JSON.stringify(student.medicalConditions || {})}
- Doctor Notes: ${student.doctorNotes || "None"}
- Physical Metrics: Weight ${student.weight}kg, Height ${student.height}cm, BMI ${student.bmi}
- Health Assessment Scores (out of 10): Flexibility ${student.flexibilityScore || 5}, Breathing ${student.breathingScore || 5}, Balance ${student.balanceScore || 5}, Fitness ${student.fitnessScore || 5}, Stress Level ${student.stressLevel || "Moderate"}
- Lifestyle: Sleep Quality: ${student.sleepQuality || "Normal"}, Water Intake: ${student.waterIntake || "Normal"}, Exercise: ${student.exerciseFrequency || "Rarely"}, Diet: ${student.diet || "Normal"}
- Attendance History: Checked-in ${student.attendanceCount || 0} times, Active status: ${student.status}.

Please generate a JSON response with the following format:
{
  "healthSummary": "A concise, empathetic summary of their overall health, physical capabilities, and caution areas.",
  "recommendations": {
    "asanas": ["List of 3-5 recommended yoga postures tailored specifically to their goals and medical restrictions"],
    "pranayama": ["List of 1-2 breathing techniques with specific instructions"],
    "meditation": "Meditation/mindfulness suggestion based on stress level and experience.",
    "cautions": ["Postures or movements they MUST strictly avoid based on their medical history (e.g. no deep backbends if back pain)"]
  },
  "predictions": {
    "dropoutRisk": "Low" | "Medium" | "High",
    "riskPercentage": 0 to 100,
    "riskFactors": ["Reasons for dropout danger, e.g. low initial attendance, high stress, or specific physical limitations"],
    "engagementAction": "A specific action the instructor can take to keep this student motivated and attending classes"
  },
  "reminderSuggestions": {
    "paymentReminder": "A personalized, gentle, yoga-inspired reminder message to suggest for overdue memberships, tailored to this student."
  }
}

Return ONLY valid JSON. No markdown backticks, no text wrappers.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text || "{}";
      const parsedData = JSON.parse(responseText.trim());
      return res.json(parsedData);
    } catch (error: any) {
      console.error("Gemini API Error in Student Analysis:", error);
      return res.status(500).json({ error: error.message || "Failed to generate AI analysis." });
    }
  });

  // Server-side Gemini API Endpoint for general Business and operational insights
  app.post("/api/gemini/business-insights", async (req: express.Request, res: express.Response) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      const { dashboardStats } = req.body;

      const prompt = `You are a senior business strategist specializing in yoga and wellness studios.
Analyze the following performance indicators for "Ayurva Yoga & Wellness" by Kumodya and generate high-level actionable growth recommendations, marketing strategies, and operational improvements.

Studio Statistics:
${JSON.stringify(dashboardStats || {})}

Please generate a JSON response with the following format:
{
  "revenueInsights": "Analysis of current monthly revenue and payment statuses.",
  "attendanceTrendSummary": "Interpretation of attendance behavior (e.g. morning vs evening peaks, dropout rates).",
  "growthSuggestions": ["3 specific, high-impact marketing or class package ideas to boost revenue and retention"],
  "instructorTip": "A wellness-focused operational tip for Kumodya to maintain a high-quality studio vibe."
}

Return ONLY valid JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const parsedData = JSON.parse((response.text || "{}").trim());
      return res.json(parsedData);
    } catch (error: any) {
      console.error("Gemini Business Insights Error:", error);
      return res.status(500).json({ error: error.message || "Failed to generate business insights." });
    }
  });

  // Serve static assets or run Vite dev server
  const isProd = process.env.NODE_ENV === "production" || process.env.VITE_PROD === "true";
  if (isProd) {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    app.use("*", async (req, res, next) => {
      try {
        const url = req.originalUrl;
        const templatePath = path.join(process.cwd(), "index.html");
        if (fs.existsSync(templatePath)) {
          let template = fs.readFileSync(templatePath, "utf-8");
          const html = await vite.transformIndexHtml(url, template);
          res.status(200).set({ "Content-Type": "text/html" }).end(html);
        } else {
          const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ayurva Yoga & Wellness Student Management System</title>
  </head>
  <body class="bg-stone-50 dark:bg-stone-950">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
          const htmlTransformed = await vite.transformIndexHtml(url, html);
          res.status(200).set({ "Content-Type": "text/html" }).end(htmlTransformed);
        }
      } catch (e) {
        next(e);
      }
    });
  }

  const PORT = process.env.PORT || 3000;
  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`[AYWSMS] Full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
