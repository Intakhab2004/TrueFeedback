export const replyTemplate = (username: string, replyMessage: string): string => {
    return (
        ` <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f7; padding: 30px;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
                <div style="background-color: #4f46e5; color: white; padding: 20px 30px;">
                    <h2 style="margin: 0;">You've received a reply on <span style="color: #ffe600;">TrueFeedback</span></h2>
                </div>
                <div style="padding: 24px 30px;">
                    <p style="font-size: 16px; color: #333;">
                        <strong>${username}</strong> has sent you a reply:
                    </p>
                    <blockquote style="border-left: 4px solid #4f46e5; margin: 20px 0; padding: 10px 16px; background-color: #f9f9ff; color: #555; font-style: italic;">
                        ${replyMessage}
                    </blockquote>
                </div>
                <div style="background-color: #f0f0f5; padding: 16px 30px; text-align: center; font-size: 12px; color: #999;">
                    © ${new Date().getFullYear()} TrueFeedback. All rights reserved.
                </div>
            </div>
          </div> `
    )
}