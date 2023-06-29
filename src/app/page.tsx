"use client";

import { addTransaction } from "./_actions/transaction";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button onClick={async () => await addTransaction()}>
        Add transaction
      </button>
    </main>
  );
}
