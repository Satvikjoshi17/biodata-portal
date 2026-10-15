import { Octokit } from "@octokit/rest";

export async function uploadImageToGitHub(
  fileBuffer: Buffer,
  filename: string
): Promise<{ url: string; error?: string }> {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  // Fallback to high quality mock/data-URL if GitHub credentials are not configured yet
  if (!token || !owner || !repo) {
    console.warn("GitHub storage credentials missing. Providing base64 data URL for preview.");
    const mime = filename.endsWith(".png") ? "image/png" : "image/jpeg";
    const base64 = fileBuffer.toString("base64");
    return {
      url: `data:${mime};base64,${base64}`,
    };
  }

  try {
    const octokit = new Octokit({ auth: token });
    const path = `uploads/${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `Upload profile image: ${filename}`,
      content: fileBuffer.toString("base64"),
      branch: "main",
    });

    // GitHub raw CDN URL
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`;
    return { url: rawUrl };
  } catch (error: any) {
    console.error("GitHub Octokit upload error:", error);
    // If upload fails, fallback to inline base64 data url with warning
    const mime = filename.endsWith(".png") ? "image/png" : "image/jpeg";
    return {
      url: `data:${mime};base64,${fileBuffer.toString("base64")}`,
      error: error?.message || "Failed to commit image to GitHub repository",
    };
  }
}
