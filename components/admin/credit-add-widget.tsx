"use client";

import { Button, Card, Field, Input } from "@/components/ui";
import { useState } from "react";

type Grant = {
  id: string;
  who: string;
  amount: number;
  at: string;
};

export function CreditAddWidget({
  professionals,
}: {
  professionals: { id: string; name: string }[];
}) {
  const [who, setWho] = useState(professionals[0]?.id ?? "");
  const [amount, setAmount] = useState("10");
  const [grants, setGrants] = useState<Grant[]>([]);
  const [message, setMessage] = useState("");

  function addCredits() {
    const credits = Number(amount);
    const pro = professionals.find((item) => item.id === who);
    if (!pro || !Number.isFinite(credits) || credits <= 0) {
      setMessage("Choose a professional and a positive amount.");
      return;
    }
    setGrants((current) => [
      {
        id: `${Date.now()}`,
        who: pro.name,
        amount: credits,
        at: "Just now",
      },
      ...current,
    ]);
    setMessage(`Added ${credits} credits to ${pro.name}.`);
  }

  return (
    <Card className="flex h-full flex-col">
      <p className="text-footnote text-muted">Credit add</p>
      <p className="mt-1 text-title font-bold tabular-nums">
        {640 + grants.reduce((sum, item) => sum + item.amount, 0)}
      </p>
      <p className="text-caption text-muted">Admin grants issued</p>
      <div className="mt-4 flex flex-col gap-3">
        <Field label="Professional">
          <select
            value={who}
            onChange={(event) => setWho(event.target.value)}
            className="min-h-11 w-full rounded-lg border border-separator bg-fill px-3 text-subhead outline-none focus:border-primary focus:ring-2 focus:ring-accent/40"
          >
            {professionals.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Credits">
          <Input
            type="number"
            min={1}
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </Field>
        <Button onClick={addCredits}>Add credits</Button>
        {message ? (
          <p className="text-footnote text-success">{message}</p>
        ) : null}
        {grants[0] ? (
          <p className="text-caption text-muted">
            Last: {grants[0].who} · +{grants[0].amount}
          </p>
        ) : null}
      </div>
    </Card>
  );
}
