import React, { useState, useEffect } from "react";
import Tesseract from "tesseract.js";

const TextRecognizer = ({
  selectedImage,
  onTextRecognized,
}: {
  selectedImage: File | null;
  onTextRecognized: (text: string) => void;
}) => {
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const recognizeText = async () => {
      if (selectedImage) {
        setProcessing(true);
        try {
          console.log("Recognizing text...");
          const result = await Tesseract.recognize(selectedImage, "fra", {
            logger: (m) => console.log(m),
          });
          onTextRecognized(result.data.text);
        } catch (error) {
          console.error("Error recognizing text:", error);
        } finally {
          setProcessing(false);
        }
      }
    };
    recognizeText();
  }, [selectedImage, onTextRecognized]);

  return (
    <div>{processing ? <p>Analyse en cours...</p> : <p>Importé !</p>}</div>
  );
};

export { TextRecognizer };
