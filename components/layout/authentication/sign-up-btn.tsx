import Link from "next/link";

export function SignUpButton() {
  return (
    <Link
      href={"/sign-in"}
      className="bg-brand text-primary-white text-sm font-medium hover:bg-brand/90 px-2 py-0.5 rounded-sm"
    >
      Sign up
    </Link>
  );
}
