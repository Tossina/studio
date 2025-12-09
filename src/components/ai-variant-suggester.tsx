"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { suggestVariantAction } from "@/app/actions";
import type { ChooseVariantOutput } from "@/ai/flows/choose-variant";
import { Loader2, Wand2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const variants = ["Texas Hold'em", "Omaha", "Stud", "Draw"] as const;

const FormSchema = z.object({
  playStyle: z
    .string()
    .min(10, {
      message: "Veuillez décrire votre style de jeu avec au moins 10 caractères.",
    })
    .max(200, {
      message: "La description ne doit pas dépasser 200 caractères.",
    }),
  variantsPlayed: z.array(z.string()).optional(),
});

export function AIVariantSuggester() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<ChooseVariantOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      playStyle: "",
      variantsPlayed: [],
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setSuggestion(null);
    setError(null);
    const result = await suggestVariantAction({
        playStyle: data.playStyle,
        variantsPlayed: data.variantsPlayed || []
    });
    if (result.success && result.data) {
        setSuggestion(result.data);
    } else {
        setError(result.error || "Une erreur inconnue est survenue.");
    }
    setIsLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Wand2 className="text-primary"/>
            Conseiller de Variante IA
        </CardTitle>
        <CardDescription>
          Décrivez votre façon de jouer, et notre IA vous suggérera une nouvelle variante de poker à essayer.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="playStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Votre style de jeu</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="ex: Je suis un joueur agressif qui aime beaucoup bluffer."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="variantsPlayed"
              render={() => (
                <FormItem>
                    <FormLabel>Variantes déjà jouées</FormLabel>
                    <div className="space-y-2">
                  {variants.map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name="variantsPlayed"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), item])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4 items-stretch">
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Obtenir une suggestion
            </Button>
            {suggestion && (
                <Alert>
                    <AlertTitle className="font-bold">Essayez {suggestion.variant} !</AlertTitle>
                    <AlertDescription>{suggestion.reason}</AlertDescription>
                </Alert>
            )}
            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
