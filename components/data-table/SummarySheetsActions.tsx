"use client";

import { Button } from "@/components/ui/button";
import { Trash, Eye, Download } from "lucide-react";
import { useState } from "react";

export type SummarySheetActionsProps = {
  row: any;
  onDelete?: (id: number) => void;
};

export const SummarySheetActions = ({
  row,
  onDelete,
}: SummarySheetActionsProps) => {
  const { id, src, alt } = row.original;
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    if (onDelete) {
      setIsDeleting(true);
      onDelete(id);
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Bouton de visualisation */}
      <Button variant="outline" size="icon" asChild>
        <a href={src} target="_blank" rel="noopener noreferrer">
          <Eye className="w-4 h-4" />
        </a>
      </Button>

      {/* Bouton de téléchargement */}
      <Button variant="outline" size="icon" asChild>
        <a href={src} download>
          <Download className="w-4 h-4" />
        </a>
      </Button>

      {/* Bouton de suppression */}
      {onDelete && (
        <Button
          variant="destructive"
          size="icon"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
