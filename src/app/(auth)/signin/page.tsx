import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SignIn signUpUrl="#" />
    </main>
  );
};

export default SignInPage;
