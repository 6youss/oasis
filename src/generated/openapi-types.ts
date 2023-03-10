/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/api/reservations": {
    /** Get all reservations */
    get: {
      /** Get all reservations */
      responses: {
        /** @description Success */
        200: {
          content: {
            "application/json": components["schemas"]["Reservation"];
          };
        };
      };
    };
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    Reservation: {
      id: number;
      start_time: number;
      end_time: number;
      resource_id: number;
      customer_id: number;
    };
    Error: {
      /** @description A human readable error message */
      message: string;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type external = Record<string, never>;

export type operations = Record<string, never>;
