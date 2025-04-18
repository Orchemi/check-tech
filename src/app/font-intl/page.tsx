export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="grid grid-cols-2 gap-0 max-w-2xl border border-gray-300">
        {/* English */}
        <div className="font-bold text-center px-6 py-2 border-b border-r border-gray-300 bg-gray-100">
          영어
        </div>
        <div className="text-center px-6 py-2 border-b border-gray-300">
          Hello
        </div>

        {/* Korean */}
        <div className="font-bold text-center px-6 py-2 border-b border-r border-gray-300 bg-gray-100">
          한글
        </div>
        <div className="text-center px-6 py-2 border-b border-gray-300">
          안녕하세요
        </div>

        {/* Japanese */}
        <div className="font-bold text-center px-6 py-2 border-b border-r border-gray-300 bg-gray-100">
          일본어
        </div>
        <div className="text-center px-6 py-2 border-b border-gray-300">
          こんにちは
        </div>

        {/* Chinese */}
        <div className="font-bold text-center px-6 py-2 border-r border-b border-gray-300 bg-gray-100">
          중국어
        </div>
        <div className="text-center px-6 py-2 border-b border-gray-300">
          你好
        </div>

        {/* Korean + English */}
        <div className="font-bold text-center px-6 py-2 border-r border-gray-300 bg-gray-100">
          한글 + 영어
        </div>
        <div className="text-center px-6 py-2">저는 Korean입니다.</div>
      </div>
    </div>
  );
}
