import { useEffect, useState, useRef } from "react";
import { fileToast } from "@/lib/toast";
import Tesseract from "tesseract.js";

const TextRecognizer = ({
  selectedImage,
  onTextRecognized,
  setIsRecognizing,
  fileId,
}: {
  selectedImage: File | null;
  onTextRecognized: (text: string) => void;
  setIsRecognizing: (isRecognizing: boolean) => void;
  fileId: string;
}) => {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    const recognizeText = async () => {
      if (selectedImage && !processing && !hasProcessed) {
        setHasProcessed(true); // Mark as processed immediately to prevent re-processing
        setProcessing(true);
        setIsRecognizing(true);
        setProgress(0);

        try {
          const result = await Tesseract.recognize(selectedImage, "fra", {
            logger: (m) => {
              if (m.status === "recognizing text") {
                const progressPercent = Math.round(m.progress * 100);
                setProgress(progressPercent);
                console.log(`OCR Progress (${fileId}): ${progressPercent}%`);
              }
            },
          });
          onTextRecognized(result.data.text);
          console.log("Final text: ", result.data.text);
        } catch (error: any) {
          console.error("Erreur lors de la reconnaissance de texte:", error);
          fileToast.recognitionError();
          setHasProcessed(false); // Reset on error so it can be retried
        } finally {
          setProcessing(false);
          setIsRecognizing(false);
        }
      }
    };

    recognizeText();
  }, [selectedImage, fileId]);

  return (
    <div>
      {processing ? (
        <p className="text-xs text-blue-600 font-medium">
          Analyse en cours... {progress}%
        </p>
      ) : (
        <p className="text-xs text-gray-500">Importé !</p>
      )}
    </div>
  );
};

export { TextRecognizer };
