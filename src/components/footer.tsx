import { Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-28 border-t-2 flex justify-center items-center text-2xl gap-2 p-4">
      Made by
      <a
        href="https://github.com/Waxer59"
        target="_blank"
        aria-label="Github"
        className="group/item">
        <Github className="w-6 h-6" />
      </a>
    </footer>
  );
}
