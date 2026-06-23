"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { GoogleButton } from "@/components/auth/google-button";
import { useAuth } from "@/components/providers/auth-provider";

const signUpSchema = z.object({
  name: z.string().min(2, "Please enter your full name."),
  email: z.email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Use at least 8 characters.")
    .regex(/[A-Za-z]/, "Include at least one letter.")
    .regex(/[0-9]/, "Include at least one number."),
  terms: z
    .boolean()
    .refine((v) => v, { message: "Please accept the terms to continue." }),
});

type SignUpValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const router = useRouter();
  const { signInWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", terms: false },
  });

  // Hand off to the backend's Google OAuth flow; it redirects back to
  // /auth/callback with tokens. The page navigates away, so the spinner stays
  // until then.
  function handleGoogle() {
    setGoogleLoading(true);
    try {
      signInWithGoogle();
    } catch {
      setGoogleLoading(false);
      toast.error("Google sign-in failed. Please try again.");
    }
  }

  // Email/password submit seam — POST to your /api/register or auth provider.
  async function onSubmit(values: SignUpValues) {
    await new Promise((r) => setTimeout(r, 600));
    toast.success(`Welcome, ${values.name.split(" ")[0]}!`, {
      description: "Account created. Hook this up to your backend next.",
    });
    router.push("/");
  }

  const busy = isSubmitting || googleLoading;

  return (
    <div className="flex flex-col gap-5">
      <GoogleButton
        onClick={handleGoogle}
        loading={googleLoading}
        disabled={busy}
      />

      {/* Divider */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or sign up with email
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Field
          id="name"
          label="Full name"
          icon={User}
          error={errors.name?.message}
        >
          <Input
            id="name"
            autoComplete="name"
            placeholder="Aarav Sharma"
            aria-invalid={!!errors.name}
            className="h-11 pl-9"
            {...register("name")}
          />
        </Field>

        <Field
          id="email"
          label="Email"
          icon={Mail}
          error={errors.email?.message}
        >
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            className="h-11 pl-9"
            {...register("email")}
          />
        </Field>

        <Field
          id="password"
          label="Password"
          icon={Lock}
          error={errors.password?.message}
        >
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            aria-invalid={!!errors.password}
            className="h-11 px-9"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </Field>

        <div className="flex items-start gap-2.5">
          <Controller
            control={control}
            name="terms"
            render={({ field }) => (
              <Checkbox
                id="terms"
                checked={field.value}
                onCheckedChange={(v) => field.onChange(v === true)}
                onBlur={field.onBlur}
                aria-invalid={!!errors.terms}
                className="mt-0.5"
              />
            )}
          />
          <Label
            htmlFor="terms"
            className="text-xs leading-relaxed font-normal text-muted-foreground"
          >
            I agree to the{" "}
            <Link href="/legal/terms" className="text-foreground underline underline-offset-2">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy" className="text-foreground underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </Label>
        </div>
        {errors.terms ? (
          <p className="-mt-2 text-xs text-destructive">{errors.terms.message}</p>
        ) : null}

        <Button
          type="submit"
          disabled={busy}
          className="bg-brand-gradient h-11 border-0 text-brand-foreground shadow-md shadow-brand/25"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

/** Labelled field wrapper with a leading icon and inline error message. */
function Field({
  id,
  label,
  icon: Icon,
  error,
  children,
}: {
  id: string;
  label: string;
  icon: React.ElementType;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        {children}
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
