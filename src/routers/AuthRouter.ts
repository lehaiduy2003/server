import AuthController from "../controllers/AuthController";
import authenticateToken from "../middlewares/authMiddleware";
import BaseRouter from "./OriginRouter";

export default class AuthRouter extends BaseRouter {
  private authController: AuthController;
  constructor() {
    super();
    this.authController = new AuthController();
  }
  public init(): void {
    this.getRouter().post("/sign-up", this.authController.post);
    this.getRouter().post("/refresh", authenticateToken, this.authController.generateNewAccessToken);
    this.getRouter().post("/sign-in", this.authController.signIn);
    this.getRouter().delete("/:id/delete", authenticateToken, this.authController.delete);
  }
}
