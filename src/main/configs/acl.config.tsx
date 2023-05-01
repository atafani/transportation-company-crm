import {Ability, subject} from "@casl/ability";

export type Subjects = string;
export type Roles = "admin" | "manager" | "driver";
export type Actions = "read" | "manage" | "create";

export type AppAbility = Ability<[Actions, Subjects]> | undefined;

export const AppAbility = Ability as any;

export type ACLObj = {
  action: Actions;
  subject: string;
};

export const defaultACLObj: ACLObj = {
  action: "read",
  subject: "",
};

export const buildAbility = (role: string): AppAbility => {
  let permissions: any[] = [];
  switch (role.toLowerCase()) {
    case "admin":
      permissions.push(
        {
          actions: ["read", "manage", "create"],
          subject: "users",
        },
        {
          actions: ["read", "manage", "create"],
          subject: "customers",
        }
      );
      break;
    case "supermanager":
      permissions.push(
        {
          actions: ["read", "manage", "create"],
          subject: "administrators",
        },
        {
          actions: ["read", "manage", "create"],
          subject: "managers",
        },
        {
          actions: ["read", "manage", "create"],
          subject: "drivers",
        },
        {
          actions: ["read", "manage", "create"],
          subject: "jobs",
        },
        {
          actions: ["read", "manage", "create"],
          subject: "clients",
        },
        {
          actions: ["read", "manage", "create"],
          subject: "invoices",
        }
      );
      break;
    case "manager":
      permissions.push(
        {
          actions: ["read", "manage", "create"],
          subject: "managers",
        },
        {
          actions: ["read", "manage", "create"],
          subject: "drivers",
        },
        {
          actions: ["read", "manage", "create"],
          subject: "jobs",
        },
        {
          actions: ["read", "manage", "create"],
          subject: "clients",
        },
        {
          actions: ["read", "manage", "create"],
          subject: "invoices",
        }
      );
      break;
    case "driver":
      permissions.push({
        actions: ["read", "manage", "create"],
        subject: "jobs",
      });
      permissions.push({
        actions: ["read", "manage", "create"],
        subject: "job-request",
      });
      break;
    default:
      break;
  }
  const abilities: any[] = [];
  permissions.forEach((permission: any) =>
    permission.actions.forEach((action: any) =>
      abilities.push({
        action,
        subject: permission.subject,
      })
    )
  );
  return new Ability([
    {
      action: "read",
      subject: "profile",
    },
    {
      action: "read",
      subject: "dashboard",
    },
    ...abilities,
  ]);
};
