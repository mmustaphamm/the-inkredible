import { Response } from "express";
import { statusCodes } from "./types";

class ResponseHandler {
  public static successResponse(message: string, DATA: any, res: Response) {
    res.status(statusCodes.success).json({
      STATUS: "SUCCESS",
      MESSAGE: message,
      DATA,
    });
  }

  public static successfullyCreated(message: string, DATA: any, res: Response) {
    res.status(statusCodes.created).json({
      STATUS: "SUCCESS",
      MESSAGE: message,
      DATA,
    });
  }

  public static invalidRequest(message: string, DATA: any, res: Response) {
    res.status(statusCodes.bad_request).json({
      STATUS: "FAILURE",
      MESSAGE: message,
      DATA,
    });
  }

  public static serverError(errMsg: string, res: Response) {
    res.status(statusCodes.internal_server_error).json({
      STATUS: "FAILURE",
      MESSAGE: "Server Error",
      DATA: errMsg,
    });
  }
}

export default ResponseHandler;
