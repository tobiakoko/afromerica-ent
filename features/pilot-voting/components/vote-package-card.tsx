"use client";
 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import type { VotePackage } from "../types/voting.types";
 
interface VotePackageCardProps {
  package: VotePackage;
  onSelect: (pkg: VotePackage) => void;
  disabled?: boolean;
}
 
export function VotePackageCard({ package: pkg, onSelect, disabled }: VotePackageCardProps) {
  return (
    <Card className={`relative ${pkg.popular ? "border-primary border-2" : ""}`}>
      {pkg.popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
          Most Popular
        </Badge>
      )}
 
      <CardHeader className="text-center">
        <CardTitle>{pkg.name}</CardTitle>
        <CardDescription>{pkg.votes} votes</CardDescription>
      </CardHeader>
 
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold">
            ${pkg.price.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">{pkg.currency}</div>
          {pkg.savings && pkg.savings > 0 && (
            <div className="text-sm text-green-600 mt-1">
              Save ${pkg.savings.toFixed(2)}
            </div>
          )}
        </div>
 
        {pkg.discount && (
          <div className="flex items-center justify-center gap-2 text-sm">
            <Check className="h-4 w-4 text-primary" />
            <span>{pkg.discount}% discount</span>
          </div>
        )}
 
        <Button
          className="w-full"
          variant={pkg.popular ? "default" : "outline"}
          onClick={() => onSelect(pkg)}
          disabled={disabled}
        >
          Select Package
        </Button>
      </CardContent>
    </Card>
  );
}