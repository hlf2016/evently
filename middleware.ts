import { authMiddleware } from "@clerk/nextjs";

// 在Clerk中，publicRoutes和ignoredRoutes在处理用户访问权限上有所不同。
// publicRoutes是指不需要用户登录就可以访问的路由列表，也就是说，这些路由的内容对所有人开放，无论他们是否已经登录。比如，你可能希望让所有访问者都可以看到网站的首页、团队介绍页等。
// 而ignoredRoutes则是指Clerk不会对其进行访问控制的路由列表，包括已登录和未登录的用户都可以访问。这更是针对那些你不希望Clerk进行任何处理的路由，比如某些API接口，或者某些完全独立，不需要用户身份验证的页面。
// 两者的主要区别在于，publicRoutes仍然在Clerk的管理范畴内，比如即使是公开路由，Clerk仍会提供用户状态（如果用户已登录的话），而ignoredRoutes则完全排除在Clerk的管理之外，Clerk不会对这些路由进行任何操作。希望这个回答能帮助你，如果有其他问题，欢迎继续提问
export default authMiddleware({
  publicRoutes: ["/", "/events/:id", "/api/webhooks(.*)"],
  ignoredRoutes: [
    "/api/webhook/clerk",
    "/api/webhook/stripe",
    "/api/uploadthing",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
