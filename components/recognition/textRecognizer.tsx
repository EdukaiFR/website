import { useEffect, useState } from "react";
import Tesseract from "tesseract.js";

const TextRecognizer = ({
  selectedImage,
  onTextRecognized,
  setIsRecognizing,
}: {
  selectedImage: File | null;
  onTextRecognized: (text: string) => void;
  setIsRecognizing: (isRecognizing: boolean) => void;
}) => {
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const recognizeText = async () => {
      if (selectedImage) {
        setProcessing(true);
        setIsRecognizing(true);

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
          setIsRecognizing(false);
        }
      }
    };

    recognizeText();
  }, [selectedImage]);

  return (
    <div>{processing ? <p>Analyse en cours...</p> : <p>Importé !</p>}</div>
  );
};

export { TextRecognizer };
