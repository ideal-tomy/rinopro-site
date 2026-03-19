"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContactForm } from "@/hooks/use-contact-form";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { status, errors, submit } = useContactForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submit({ name, email, message });
    if (success) {
      setName("");
      setEmail("");
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-text">
          お名前
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="山田 太郎"
          className={cn(errors.name && "border-red-500")}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-text">
          メールアドレス
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@example.com"
          className={cn(errors.email && "border-red-500")}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>
      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium text-text">
          お問い合わせ内容
        </label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="お気軽にご相談ください"
          rows={5}
          className={cn(errors.message && "border-red-500")}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-500">{errors.message}</p>
        )}
      </div>
      {status === "success" && (
        <p className="text-sm text-accent">送信しました。ありがとうございます。</p>
      )}
      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "送信中..." : "送信する"}
      </Button>
    </form>
  );
}
