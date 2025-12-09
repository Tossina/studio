"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

interface ActionButtonsProps {
    playerStack: number;
    currentBet: number;
    minRaise: number;
}

export function ActionButtons({ playerStack, currentBet, minRaise }: ActionButtonsProps) {
  const [raiseAmount, setRaiseAmount] = useState(minRaise);

  const canCheck = currentBet === 0;

  const handleSliderChange = (value: number[]) => {
    setRaiseAmount(value[0]);
  }

  const quickRaiseAmounts = [0.5, 0.75, 1]; // 50%, 75%, Pot

  return (
    <div className="w-full max-w-4xl mx-auto p-4 rounded-lg bg-card/50">
        <div className="flex justify-between items-center">
            {/* Left side actions */}
            <div className="flex items-center gap-6">
                <div className="flex items-center space-x-2">
                    <Checkbox id="check-fold" />
                    <Label htmlFor="check-fold" className="text-sm text-muted-foreground">Check/Fold</Label>
                </div>
                 <div className="flex items-center space-x-2">
                    <Checkbox id="auto-muck" />
                    <Label htmlFor="auto-muck" className="text-sm text-muted-foreground">Auto Muck</Label>
                </div>
            </div>

            {/* Main action buttons */}
            <div className="flex items-center gap-2">
                <Button variant="outline" className="w-32 h-14 text-lg font-bold bg-secondary hover:bg-secondary/80">Fold</Button>
                <Button variant="outline" className="w-32 h-14 text-lg font-bold bg-secondary hover:bg-secondary/80">{canCheck ? 'Check' : `Call ${currentBet}`}</Button>
                <div className="relative">
                     <Button className="w-48 h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground flex flex-col items-center justify-center leading-tight">
                        <span>Raise</span>
                        <span className="text-sm font-normal">to {raiseAmount.toLocaleString()} Ar</span>
                    </Button>
                </div>
            </div>

             {/* Raise slider */}
            <div className="flex items-center gap-3 w-64">
                <Slider 
                    min={minRaise} 
                    max={playerStack} 
                    step={100}
                    value={[raiseAmount]}
                    onValueChange={handleSliderChange}
                />
            </div>
        </div>
    </div>
  );
}
