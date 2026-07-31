import LoginForm from "../@global/(.)auth/_components/MainContent";

export default function Page() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-[#090909]">
      <div className="w-full max-w-lg rounded-2xl bg-[#090909] border border-neutral-800 shadow-2xl p-6">
        <LoginForm isStandalone={true} />
      </div>
    </div>
  );
}
