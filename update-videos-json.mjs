import fs from "fs/promises";
import path from "path";

const videosFolder = "./public/videos";
const dataFile = "./src/data/videos.json";
const reportFile = "./update-report.txt";
const mergedOutputFile = "./videos-merged.json";

// Helpers
const fileBase = (file) => path.parse(file).name;
const isValidFile = (file) =>
  !/^\./.test(file) &&
  !file.endsWith(".DS_Store") &&
  !file.endsWith("Thumbs.db") &&
  !file.endsWith(".tmp");

async function main() {
  try {
    const [jsonRaw, files] = await Promise.all([
      fs.readFile(dataFile, "utf-8"),
      fs.readdir(videosFolder),
    ]);

    // Parse JSON safely
    let json = [];
    try {
      json = JSON.parse(jsonRaw);
    } catch {
      console.warn("⚠️ Warning: Could not parse JSON file, starting fresh.");
    }

    // Ensure all entries have an ID
    json = json.map((v, i) => ({
      ...v,
      id: v.id || String(i + 1),
    }));

    const cleanFiles = files.filter(isValidFile);
    const videoFiles = cleanFiles.filter((f) => f.endsWith(".mp4"));
    const imageFilesSet = new Set(
      cleanFiles
        .filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f))
        .map((f) => fileBase(f))
    );

    const jsonSources = new Set(json.map((v) => fileBase(v.src)));
    const jsonThumbnails = new Set(json.map((v) => fileBase(v.thumbnail)));

    // Detect new videos
    const newVideos = videoFiles.filter((f) => !jsonSources.has(fileBase(f)));

    // Detect missing video files in folder
    const missingVideos = json.filter(
      (v) => !videoFiles.includes(path.basename(v.src))
    );

    // Detect missing thumbnails in folder
    const missingThumbnails = json.filter(
      (v) => !imageFilesSet.has(fileBase(v.thumbnail))
    );

    // 📄 Report
    let report = "──────────────────────────────\n";
    report += "📂 VIDEO FOLDER CHECK REPORT\n";
    report += "──────────────────────────────\n\n";

    report += `📊 SUMMARY\n`;
    report += `──────────────────────────────\n`;
    report += `• JSON entries: ${json.length}\n`;
    report += `• Video files:  ${videoFiles.length}\n`;
    report += `• Thumbnails:   ${imageFilesSet.size}\n`;
    report += `• New videos detected: ${newVideos.length}\n`;
    report += `• Missing videos in JSON: ${missingVideos.length}\n`;
    report += `• Missing thumbnails: ${missingThumbnails.length}\n\n`;

    // 🆕 New video templates
    if (newVideos.length > 0) {
      report += `🆕 NEW VIDEOS FOUND (${newVideos.length}):\n\n`;
      newVideos.forEach((f, i) => {
        const id = json.length + i + 1;
        const base = fileBase(f);
        const template = {
          id: `${id}`,
          title: base,
          year: new Date().getFullYear(),
          program: "Adobe Premiere Pro",
          category: "TBD",
          thumbnail: `/videos/${base}.png`,
          src: `/videos/${f}`,
          description: "TBD",
          contributors: "",
          music: "",
          contributorLink: "",
        };
        report += JSON.stringify(template, null, 2) + ",\n\n";
      });
    } else {
      report += "✅ No new videos found.\n\n";
    }

    // ⚠️ Missing video files
    if (missingVideos.length > 0) {
      report += "⚠️  Missing video files:\n";
      missingVideos.forEach((v) => (report += ` - ${v.src}\n`));
      report += "\n";
    }

    // ⚠️ Missing thumbnails
    if (missingThumbnails.length > 0) {
      report += "⚠️  Missing thumbnails:\n";
      missingThumbnails.forEach((v) => (report += ` - ${v.thumbnail}\n`));
      report += "\n";
    }

    report += "✅ Check complete.\n";
    report += "──────────────────────────────\n";

    // 🧩 Add new entries and sort by ID
    const newEntries = newVideos.map((f, i) => {
      const id = json.length + i + 1;
      const base = fileBase(f);
      return {
        id: `${id}`,
        title: base,
        year: new Date().getFullYear(),
        program: "Adobe Premiere Pro",
        category: "TBD",
        thumbnail: `/videos/${base}.png`,
        src: `/videos/${f}`,
        description: "TBD",
        contributors: "",
        music: "",
        contributorLink: "",
      };
    });

    const mergedJson = [...json, ...newEntries].sort(
      (a, b) => Number(a.id) - Number(b.id)
    );

    // ✍️ Write outputs
    await Promise.all([
      fs.writeFile(reportFile, report, "utf-8"),
      fs.writeFile(mergedOutputFile, JSON.stringify(mergedJson, null, 2), "utf-8"),
    ]);

    console.log(`✅ Report saved to ${reportFile}`);
    console.log(`✅ Merged JSON created at ${mergedOutputFile}`);
    console.log("🔍 Review and paste manually if desired.");
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

main();
