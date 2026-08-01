import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

// Единственный API-роут проекта: @vercel/blob/client требует HTTP-эндпоинт
// для выдачи токена на прямую загрузку с клиента (байты фото никогда не
// идут через server action — там лимит тела 1 МБ).
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const session = await getSession();
        if (!session) throw new Error("Не авторизовано");

        return {
          allowedContentTypes: ["image/webp", "image/jpeg"],
          maximumSizeInBytes: 3 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      // onUploadCompleted не задаём: запись в БД делаем отдельным server
      // action'ом (src/actions/images.ts) после того как клиент получит оба
      // URL (полный + миниатюра) — коллбэк с vercel.com сюда не достучится
      // в локальной разработке, да и не нужен.
    });

    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Ошибка загрузки" },
      { status: 400 },
    );
  }
}
