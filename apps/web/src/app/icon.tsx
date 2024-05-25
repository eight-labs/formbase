import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        //   TODO: fix
        tw="flex items-center justify-center bg-black text-[24px] leading-8 text-white"
        style={{
          width: 32,
          height: 32,
        }}
      >
        8{/* Formbase,  Eight Labs */}
      </div>
    ),
    {
      ...size,
    },
  );
}
