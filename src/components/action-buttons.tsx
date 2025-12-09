"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Card } from "./ui/card";

interface ActionButtonsProps {
    playerStack: number;
    currentBet: number;
}

export function ActionButtons({ playerStack, currentBet }: ActionButtonsProps) {
  const [raiseAmount, setRaiseAmount] = useState(currentBet * 2);

  const canCheck = currentBet === 0;

  return (
    <Card className="flex-grow p-4 bg-card/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 items-center">
            <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">Fold</Button>
            <Button variant="secondary">{canCheck ? 'Check' : `Call $${currentBet}`}</Button>
            <div className="col-span-2 flex flex-col gap-2">
                 <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Raise to ${raiseAmount}</Button>
                 <div className="flex gap-2 items-center">
                    <Slider 
                        min={currentBet * 2} 
                        max={playerStack} 
                        step={10} 
                        value={[raiseAmount]}
                        onValueChange={(value) => setRaiseAmount(value[0])}
                    />
                 </div>
            </div>
        </div>
    </Card>
  );
}
