const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads');
const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'applications.json');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5mb, same limit as frontend
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
    ];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('File type not allowed'));
    }
    cb(null, true);
  },
});

router.post(
  '/',
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
  ]),
  (req, res) => {
    try {
      const { fullName, email, phone, dob, employmentStatus } = req.body;

      // basic server side check, don't fully trust the frontend validation
      if (!fullName || !email || !phone || !dob || !employmentStatus) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      if (!req.files || !req.files.resume) {
        return res.status(400).json({ message: 'Resume file is required' });
      }

      let certifications = [];
      if (req.body.certifications) {
        try {
          certifications = JSON.parse(req.body.certifications);
        } catch (e) {
          certifications = [];
        }
      }

      let applications = [];
      if (fs.existsSync(dataFile)) {
        applications = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
      }

      const newApplication = {
        id: Date.now(),
        fullName,
        email,
        phone,
        dob,
        employmentStatus,
        companyName: req.body.companyName || null,
        jobTitle: req.body.jobTitle || null,
        schoolName: req.body.schoolName || null,
        graduationYear: req.body.graduationYear || null,
        certifications,
        resumeFile: req.files.resume[0].filename,
        photoFile: req.files.photo ? req.files.photo[0].filename : null,
        submittedAt: new Date().toISOString(),
      };

      applications.push(newApplication);
      fs.writeFileSync(dataFile, JSON.stringify(applications, null, 2));

      res.status(201).json({ message: 'Application submitted', id: newApplication.id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error, please try again later' });
    }
  }
);

module.exports = router;
