import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

const jobs = [
  {
    id: 1,
    description: "Configure a agent to answer phones at a doctor's office.",
  },
  {
    id: 2,
    description: "Add a tool to your agent.",
  },
  {
    id: 3,
    description: "Deploy your agent to the cloud.",
  },
  {
    id: 4,
    description: "Copy and share a sandbox link to your agent.",
  },
  {
    id: 5,
    description: "Find the source code to embed the agent in your app.",
  },
  {
    id: 6,
    description: "Download your agent's source code.",
  },
];

export default function Home() {
  return (
    <div className="h-full w-full flex flex-col gap-4 items-start justify-start p-8 bg-bg0 overflow-scroll">
      {/* Page content */}
      <div className="flex flex-col gap-8 w-full  ">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl">Agent builder prototype</h1>
          <p className="text-fg1 text-md max-w-[65ch]">
            This is a prototype built by the design team at Livekit to help us
            test and iterate on the agent builder experience. Use the job list
            below to guide your experience and leave feedback.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 py-2 items-center justify-between w-full">
            <h2 className="text-fg0 text-md font-semibold">
              Here are the jobs to test:
            </h2>
            <Link href="/layout-2">
              <Button variant="primary">Start the experience</Button>
            </Link>
          </div>
          <div className="flex flex-col gap-2 border border-separator1 rounded w-full ">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex flex-row gap-4 items-center justify-start border-b border-separator1 px-4 py-2 w-full"
              >
                <Checkbox />
                <p className="text-fg1 text-base">{job.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 py-2 items-center justify-between w-full">
            <h2 className="text-fg0 text-md font-semibold">
              View the Figma file
            </h2>
            <Button variant="secondary">Go to Figma</Button>
          </div>
          <iframe
            className="w-full min-h-[75vh] border-0"
            src="https://embed.figma.com/design/fDHf3GUsSC0I14rINidJJS/Agent-builder?node-id=605-43952&embed-host=share"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}
