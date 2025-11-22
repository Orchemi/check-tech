import Link from 'next/link';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 flex h-20 w-full items-center justify-center gap-4 bg-white">
      <Link href="/link-test/a">A</Link>
      <Link href="/link-test/b">B</Link>
    </header>
  );
};

export default Header;
