
// // server/routes/designs.js
// const express = require("express");
// const AWS = require("aws-sdk");
// const Design = require("../models/Design");
// const verifyToken = require("../middlewares/verifyToken");

// const router = express.Router();

// // Configure AWS SDK
// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// // ✅ Helper: upload single base64 image to S3
// async function uploadBase64ToS3(base64, userId) {
//   const base64Data = Buffer.from(
//     base64.replace(/^data:image\/\w+;base64,/, ""),
//     "base64"
//   );
//   const type = base64.split(";")[0].split("/")[1];
//   const fileName = `designs/${Date.now()}-${userId}.${type}`;

//   const uploadResult = await s3
//     .upload({
//       Bucket: process.env.AWS_S3_BUCKET,
//       Key: fileName,
//       Body: base64Data,
//       ContentEncoding: "base64",
//       ContentType: `image/${type}`,
//     })
//     .promise();

//   return uploadResult.Location;
// }

// // ✅ Replace all base64 images in fabric JSON with S3 URLs
// async function replaceBase64Images(jsonData, userId) {
//   let parsed = typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;

//   if (!parsed.objects) return parsed;

//   const updatedObjects = [];
//   for (const obj of parsed.objects) {
//     if (obj.type === "image" && obj.src?.startsWith("data:")) {
//       const s3Url = await uploadBase64ToS3(obj.src, userId);
//       updatedObjects.push({ ...obj, src: s3Url });
//     } else {
//       updatedObjects.push(obj);
//     }
//   }

//   parsed.objects = updatedObjects;
//   return parsed;
// }

// // 📌 Upload new design
// router.post("/upload", verifyToken, async (req, res) => {
//   try {
//     const { image, name, data } = req.body;
//     if (!image || !name || !data) {
//       return res.status(400).json({ msg: "Image, name, and data are required" });
//     }

//     // 🟢 Replace all base64 images in jsonData
//     const parsedData = await replaceBase64Images(data, req.user.uid);

//     // Also upload the main canvas preview (PNG)
//     const previewUrl = await uploadBase64ToS3(image, req.user.uid);

//     const newDesign = new Design({
//       title: name,
//       jsonData: parsedData,
//       userId: req.user.uid,
//       s3Url: previewUrl,
//     });

//     await newDesign.save();
//     res.json({ msg: "Design uploaded successfully", design: newDesign });
//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).json({ msg: "Failed to upload design", error: err.message });
//   }
// });

// // 📌 Get all designs
// router.get("/", verifyToken, async (req, res) => {
//   try {
//     const designs = await Design.find({ userId: req.user.uid });
//     res.json(designs);
//   } catch (err) {
//     res.status(500).json({ msg: "Failed to fetch designs" });
//   }
// });

// // 📌 Get single design
// router.get("/:id", verifyToken, async (req, res) => {
//   try {
//     const design = await Design.findOne({
//       _id: req.params.id,
//       userId: req.user.uid,
//     });
//     if (!design) return res.status(404).json({ msg: "Design not found" });
//     res.json(design);
//   } catch (err) {
//     res.status(500).json({ msg: "Failed to fetch design" });
//   }
// });

// // 📌 Update design
// router.put("/:id", verifyToken, async (req, res) => {
//   try {
//     const { name, data, image } = req.body;

//     // 🟢 Replace base64 inside jsonData with S3 URLs
//     let parsedData = await replaceBase64Images(data, req.user.uid);

//     let updatedFields = { title: name, jsonData: parsedData };

//     // If new canvas preview (base64) is provided → upload again
//     if (image?.startsWith("data:image")) {
//       const previewUrl = await uploadBase64ToS3(image, req.user.uid);
//       updatedFields.s3Url = previewUrl;
//     }

//     const design = await Design.findOneAndUpdate(
//       { _id: req.params.id, userId: req.user.uid },
//       updatedFields,
//       { new: true }
//     );

//     if (!design) return res.status(404).json({ msg: "Design not found" });

//     res.json({ msg: "Design updated", design });
//   } catch (err) {
//     console.error("Update error:", err);
//     res.status(500).json({ msg: "Failed to update design", error: err.message });
//   }
// });

// // 📌 Delete design
// router.delete("/:id", verifyToken, async (req, res) => {
//   try {
//     const design = await Design.findOneAndDelete({
//       _id: req.params.id,
//       userId: req.user.uid,
//     });

//     if (!design) return res.status(404).json({ msg: "Design not found" });

//     // Delete preview from S3
//     if (design.s3Url) {
//       const Key = design.s3Url.split(".amazonaws.com/")[1];
//       await s3.deleteObject({
//         Bucket: process.env.AWS_S3_BUCKET,
//         Key,
//       }).promise();
//     }

//     res.json({ msg: "Design deleted" });
//   } catch (err) {
//     res.status(500).json({ msg: "Failed to delete design", error: err.message });
//   }
// });

// module.exports = router;




const express = require("express");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const Design = require("../models/Design");
const verifyToken = require("../middlewares/verifyToken");
const s3 = require("../utils/s3");

const router = express.Router();

// ✅ Helper: upload single base64 image to S3
async function uploadBase64ToS3(base64, userId) {
  const base64Data = Buffer.from(
    base64.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const type = base64.split(";")[0].split("/")[1];
  const fileName = `designs/${Date.now()}-${userId}.${type}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fileName,
    Body: base64Data,
    ContentEncoding: "base64",
    ContentType: `image/${type}`,
  });

  await s3.send(command);

  // Return the public URL of the uploaded file
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
}

// ✅ Replace all base64 images in fabric JSON with S3 URLs
async function replaceBase64Images(jsonData, userId) {
  let parsed = typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;

  if (!parsed.objects) return parsed;

  const updatedObjects = [];
  for (const obj of parsed.objects) {
    if (obj.type === "image" && obj.src?.startsWith("data:")) {
      const s3Url = await uploadBase64ToS3(obj.src, userId);
      updatedObjects.push({ ...obj, src: s3Url });
    } else {
      updatedObjects.push(obj);
    }
  }

  parsed.objects = updatedObjects;
  return parsed;
}

// 📌 Upload new design
router.post("/upload", verifyToken, async (req, res) => {
  try {
    const { image, name, data } = req.body;
    if (!image || !name || !data) {
      return res.status(400).json({ msg: "Image, name, and data are required" });
    }

    // 🟢 Replace all base64 images in jsonData
    const parsedData = await replaceBase64Images(data, req.user.uid);

    // Also upload the main canvas preview (PNG)
    const previewUrl = await uploadBase64ToS3(image, req.user.uid);

    const newDesign = new Design({
      title: name,
      jsonData: parsedData,
      userId: req.user.uid,
      s3Url: previewUrl,
    });

    await newDesign.save();
    res.json({ msg: "Design uploaded successfully", design: newDesign });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ msg: "Failed to upload design", error: err.message });
  }
});

// 📌 Get all designs
router.get("/", verifyToken, async (req, res) => {
  try {
    const designs = await Design.find({ userId: req.user.uid });
    res.json(designs);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch designs" });
  }
});

// 📌 Get single design
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const design = await Design.findOne({
      _id: req.params.id,
      userId: req.user.uid,
    });
    if (!design) return res.status(404).json({ msg: "Design not found" });
    res.json(design);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch design" });
  }
});

// 📌 Update design
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { name, data, image } = req.body;

    // 🟢 Replace base64 inside jsonData with S3 URLs
    let parsedData = await replaceBase64Images(data, req.user.uid);

    let updatedFields = { title: name, jsonData: parsedData };

    // If new canvas preview (base64) is provided → upload again
    if (image?.startsWith("data:image")) {
      const previewUrl = await uploadBase64ToS3(image, req.user.uid);
      updatedFields.s3Url = previewUrl;
    }

    const design = await Design.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
      updatedFields,
      { new: true }
    );

    if (!design) return res.status(404).json({ msg: "Design not found" });

    res.json({ msg: "Design updated", design });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ msg: "Failed to update design", error: err.message });
  }
});

// 📌 Delete design
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const design = await Design.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.uid,
    });

    if (!design) return res.status(404).json({ msg: "Design not found" });

    // Delete preview from S3
    if (design.s3Url) {
      const Key = design.s3Url.split(".amazonaws.com/")[1];
      const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key,
      });
      await s3.send(command);
    }

    res.json({ msg: "Design deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ msg: "Failed to delete design", error: err.message });
  }
});

module.exports = router;
