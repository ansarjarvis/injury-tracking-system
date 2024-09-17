"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Injury {
  id: number;
  x: number;
  y: number;
  details: string;
}

export default function InjuryReport() {
  const [reporterName, setReporterName] = useState("");
  const [injuryDateTime, setInjuryDateTime] = useState("");
  const [injuries, setInjuries] = useState<Injury[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  let router = useRouter();

  const mutation = useMutation({
    mutationFn: async (reportData: any) => {
      const response = await fetch("/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to submit the report");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Succesfully Created");
      router.push("/injuryList");
    },
    onError: (error: any) => {
      alert("Failed to submit the report: " + error.message);
    },
  });

  useEffect(() => {
    if (imageLoaded) {
      drawBodyMap();
    }
  }, [imageLoaded, injuries]);

  const drawBodyMap = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas && ctx && imageRef.current) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);

      injuries.forEach((injury, index) => {
        ctx.beginPath();
        ctx.arc(injury.x, injury.y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText((index + 1).toString(), injury.x, injury.y);
      });
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const newInjury: Injury = {
        id: injuries.length + 1,
        x,
        y,
        details: "",
      };
      setInjuries([...injuries, newInjury]);
    }
  };

  const handleInjuryDetailChange = (id: number, details: string) => {
    setInjuries(
      injuries.map((injury) =>
        injury.id === id ? { ...injury, details } : injury
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ reporterName, injuryDateTime, injuries });
    let reportData = { reporterName, injuryDateTime, injuries };
    mutation.mutate(reportData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Injury Report</h1>

      <div className="space-y-2">
        <Label htmlFor="reporterName">Name of Reporter</Label>
        <Input
          id="reporterName"
          value={reporterName}
          onChange={(e) => setReporterName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="injuryDateTime">Date & Time of Injury</Label>
        <Input
          id="injuryDateTime"
          type="datetime-local"
          value={injuryDateTime}
          onChange={(e) => setInjuryDateTime(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bodyMap">Body Map</Label>
        <p id="bodyMapInstructions" className="text-sm text-muted-foreground">
          Click on the body to mark injury locations
        </p>
        <div className="relative" style={{ width: "300px", height: "500px" }}>
          <Image
            src="/human-image.jpg"
            alt="Body map"
            width={300}
            height={500}
            ref={imageRef}
            onLoad={handleImageLoad}
          />
          <canvas
            ref={canvasRef}
            width={300}
            height={500}
            onClick={handleCanvasClick}
            className="border border-gray-300 cursor-pointer absolute top-0 left-0"
            aria-labelledby="bodyMapInstructions"
          />
        </div>
      </div>

      {injuries.map((injury) => (
        <div key={injury.id} className="space-y-2">
          <Label htmlFor={`injury-${injury.id}`}>
            Injury {injury.id} Details
          </Label>
          <Textarea
            id={`injury-${injury.id}`}
            value={injury.details}
            onChange={(e) =>
              handleInjuryDetailChange(injury.id, e.target.value)
            }
            placeholder={`Describe injury ${injury.id}`}
          />
        </div>
      ))}

      <Button type="submit">Submit Report</Button>
    </form>
  );
}
