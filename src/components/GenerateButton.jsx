import "./styles.css";
import OpenAI from "openai";
import { useState } from "react";



const GenerateButton = ({ appImage, loadingSetter}) => {
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function getImage() {
    if (!appImage || appImage.length === 0) {
      alert("No image provided. Please upload an image first.");
      return;
    }

    setIsLoading(true);

    try {
      const openai = new OpenAI({
        apiKey: process.env.REACT_APP_API_KEY,
        dangerouslyAllowBrowser: true
      });

      const prompt = `Use the uploaded image as the content of the top 80% of a vertical pill-shaped capsule, perfectly centered in a 1:1 square canvas. Render the bottom 20% of the capsule as a smooth, shiny silver metallic surface with subtle specular highlights, gentle gradient shading, and a faint reflection. Place the capsule on a uniform white background. The entire illustration should appear as a realistic artwork: realistic reflections, metal light diffusion, hard edges, realistic shadows, diffuse lighting. Ensure the uploaded image's proportions and details are preserved, seamlessly integrated into the pill's upper half. Finally, add a very soft drop shadow beneath the capsule to ground it on the canvas.`;

      // Use the first image from appImage array
      const imageObj = appImage[0];

      // Convert blob to base64
      const toBase64 = (blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            // Extract just the base64 part (after the comma)
            const base64 = reader.result.split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };

      let base64Image = null;
      if (imageObj.blob) {
        base64Image = await toBase64(imageObj.blob);
      } else {
        alert("Could not extract image data from uploaded file.");
        setIsLoading(false);
        return;
      }

      const response = await openai.responses.create({
        model: "gpt-4.1",
        input: [
          {
            role: "user",
            content: [
              { type: "input_text", text: prompt },
              {
                type: "input_image",
                image_url: `data:image/png;base64,${base64Image}`,
              },
            ],
          },
        ],
        tools: [{ type: "image_generation" }],
      });

      const imageData = response.output
        .filter((output) => output.type === "image_generation_call")
        .map((output) => output.result);

      if (imageData.length > 0) {
        const imageBase64 = imageData[0];
        setGeneratedImage(`data:image/png;base64,${imageBase64}`);
      } else {
        console.log(response.output.content);
        alert("Failed to generate image.");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      alert("An error occurred while generating the image.");
    } finally {
      setIsLoading(false);
      setDone(true);
      loadingSetter(true);
    }
  }

  return (
  <>
    {!done && (
      <button onClick={getImage} disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate"}
      </button>
    )}

    {generatedImage && (
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <img
          src={generatedImage}
          alt="Generated Capsule"
          style={{ maxHeight: "60%", marginTop: "25px", borderRadius: "8px" }}
        />

        {/* ← Download link */}
        <div style={{ marginTop: "12px" }}>
          <a
            href={generatedImage}
            download="pill-capsule.png"
            style={{ textDecoration: "none" }}
          >
            <button>Download Capsule</button>
          </a>
        </div>
      </div>
    )}
  </>
);

};

export default GenerateButton;
