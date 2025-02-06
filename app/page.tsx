import Image from "next/image";

export default function Home() {
  return (
    <div
      className="
        items-center 
        justify-items-center 
       pt-16
        font-[family-name:var(--font-geist-sans)]
        bg-colors-primary  
        text-colors-secondary 
        transition-colors 
        duration-300
      "
    >
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-colors-secondary/5 dark:bg-colors-secondary/10 px-1 py-0.5 rounded font-semibold">
              app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="
              rounded-full 
              border border-solid border-colors-secondary/20 
              transition-colors 
              flex items-center justify-center
              text-white
              dark:hover:text-colors-secondary
              gap-2 
              hover:bg-black/70
              dark:hover:bg-black/10
              bg-colors-secondary
              dark:text-colors-primary
              text-sm sm:text-base 
              h-10 sm:h-12 px-4 sm:px-5
            "
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>

          <a
            className="
              rounded-full 
              border border-colors-secondary/20
              transition-colors 
              flex items-center justify-center 
              hover:bg-colors-secondary/5
              text-sm sm:text-base 
              h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44
            "
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>

     
        </div>
            {/* {[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11,12,13,15,231,231 ].map((i)=>(
               <div key={i} className="flex gap-4 items-center flex-col sm:flex-row">
                s
               </div>
            ))} */}
      </main>
    </div>
  );
}