import { z } from "zod";
import { PutObjectCommand, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { protectedProcedure, router } from "@/server/trpc";

const bucket = "uploadimage-1308004794";
const apiEndpoint = "https://cos.ap-chengdu.myqcloud.com";
const region = "ap-chengdu";
const COS_APP_ID = process.env.COS_APP_ID;
const COS_APP_SECRET = process.env.COS_APP_SECRET;

export const fileRoutes = router({
  createPresignedUrl: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        contentType: z.string(),
        size: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const date = new Date();
      const isoString = date.toISOString();
      console.log("图片上传日期:", isoString);
      const dateString = isoString.split("T")[0];

      const params: PutObjectCommandInput = {
        Bucket: bucket,
        Key: `${dateString}/${input.filename.replaceAll(" ", "_")}`,
        ContentType: input.contentType,
        ContentLength: input.size,
      };

      const s3Client = new S3Client({
        endpoint: apiEndpoint,
        region: region,
        credentials: {
          accessKeyId: COS_APP_ID,
          secretAccessKey: COS_APP_SECRET,
        },
      });

      const command = new PutObjectCommand(params);
      const url = await getSignedUrl(s3Client, command, {
        expiresIn: 60,
      });

      return {
        url,
        method: "PUT" as const,
      };
    }),
});