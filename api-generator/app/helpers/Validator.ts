import models from "app/models";
import { Op } from "sequelize";

type IRuleCustom = (config: {
  setMessage: (value: string) => boolean;
  value: string | number;
  label: string;
}) => Promise<boolean> | boolean;

type IRule = {
  required?: boolean;
  number?: boolean;
  email?: boolean;
  unique?: string;
  equalsTo?: string;
  customWithRegex?: {
    regex: string;
    message: string;
  };
  custom?: IRuleCustom;
};

type IRuleItem = {
  label: string;
  rule: IRule;
};

export type IRules = {
  [key: string]: IRuleItem;
};

type IBodyValue = string | number;

type IBody = {
  [key: string]: IBodyValue;
};

type IErrMsg = {
  [key: string]: string[];
};
type IValidator = {
  make: (
    body: IBody,
    rules: IRules
  ) => Promise<{
    fails: () => boolean;
    getMessages: () => IErrMsg;
  }>;
};

type IUniqueness = (
  model: keyof typeof models,
  column: keyof IBody,
  value: IBodyValue,
  ignoreId: string | null,
  ignoreIdColumn: string | null
) => Promise<any>;

const uniqueness: IUniqueness = async function (
  model,
  column,
  value,
  ignoreId = null,
  ignoreIdColumn = null
) {
  var modelnya = models[model];
  var query: {
    where: {
      [key: string]: { [key: symbol]: IBodyValue } | IBodyValue;
    };
  } = {
    where: {},
  };
  query.where[column] = value;
  if (ignoreId != null && ignoreIdColumn != null) {
    query.where[ignoreIdColumn] = {
      [Op.ne]: ignoreId,
    };
  }

  return modelnya.findAll(query);
  // var algo = ""
  // if(ignoreId!=null){
  //     algo = algo + ' AND ' + ignoreIdColumn + ' != "' + ignoreId + '"';
  // }
  // return await db.query('select * from '+table+' where '+column+'="'+value+'" '+algo+' limit 1');
};

const Validator: IValidator = {
  make: async function (body, rules) {
    let error = 0;
    let err_msg: IErrMsg = {};
    for (let key in rules) {
      let rule = rules[key];
      let label =
        rule.label == null || rule.label === undefined || rule.label === ""
          ? key
          : rule.label;

      let noRule = 0;
      for (let keyRule in rule.rule) {
        if (keyRule === "required") {
          if (rule.rule[keyRule]) {
            if (
              typeof body[key] === "undefined" ||
              body[key] == null ||
              body[key] === undefined ||
              body[key] === ""
            ) {
              if (noRule === 0) {
                err_msg[key] = [];
              }
              err_msg[key].push(`${label} is required.`);
              noRule++;
              error++;
            }
          } else {
            continue;
          }
        } else if (keyRule === "unique") {
          if (rule.rule[keyRule] !== undefined) {
            let uniqueRule = rule.rule?.[keyRule]?.split(",");
            let table = uniqueRule?.[0] as unknown as keyof typeof models;
            let column = uniqueRule?.[1] as unknown as string;
            let ignoreId = null;
            let ignoreIdColumn = "id";
            if (uniqueRule?.[2] !== undefined) {
              ignoreId = uniqueRule[2];
            }
            if (uniqueRule?.[3] !== undefined) {
              ignoreIdColumn = uniqueRule[3];
            }
            const bodyKey = body[key];
            await uniqueness(
              table,
              column,
              bodyKey,
              ignoreId,
              ignoreIdColumn
            ).then(function (res) {
              if (res[0]) {
                if (noRule === 0) {
                  err_msg[key] = [];
                }
                err_msg[key].push(`${label} is already in use.`);
                noRule++;
                error++;
              }
            });
          } else {
            continue;
          }
        } else if (keyRule === "email") {
          if (rule.rule[keyRule]) {
            var re =
              // eslint-disable-next-line no-useless-escape
              /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (
              typeof body[key] !== "undefined" &&
              !re.test(body[key].toString().toLowerCase().trim())
            ) {
              if (noRule === 0) {
                err_msg[key] = [];
              }
              err_msg[key].push(`${label} is invalid.`);
              noRule++;
              error++;
            }
          }
        } else if (keyRule === "equalsTo") {
          if (rule.rule[keyRule]) {
            var value2 = body[rule.rule[keyRule] as keyof IBody];

            var key2 = rule.rule[keyRule] as keyof IRuleItem;

            var label2 =
              rules[key2].label == null ||
              rules[key2].label === undefined ||
              rules[key2].label === ""
                ? key2
                : rules[key2].label;

            if (body[key] !== value2) {
              if (noRule === 0) {
                err_msg[key] = [];
              }

              err_msg[key].push(`${label} must be match to ${label2}.`);
              noRule++;
              error++;
            }
          }
        } else if (keyRule === "customWithRegex") {
          if (
            typeof rule.rule[keyRule]?.regex !== "undefined" &&
            typeof rule.rule[keyRule]?.message !== "undefined"
          ) {
            // eslint-disable-next-line no-eval
            var re: RegExp = eval("/" + rule.rule[keyRule]?.regex + "/i");

            if (!re.test(body[key].toString().trim())) {
              if (noRule === 0) {
                err_msg[key] = [];
              }
              var new_message = (rule.rule[keyRule]?.message as string).replace(
                "%s",
                label
              );
              err_msg[key].push(new_message);
              noRule++;
              error++;
            }
          }
        } else if (keyRule === "custom") {
          if (!!rule.rule[keyRule]) {
            let new_message = "";
            function setMessage(value: string) {
              new_message = value;
              return false;
            }

            let result = await rule.rule[keyRule]?.({
              setMessage,
              value: body[key],
              label,
            });

            if (!result) {
              if (noRule === 0) {
                err_msg[key] = [];
              }
              err_msg[key].push(new_message);
              noRule++;
              error++;
            }
          }
        } else if (keyRule === "number") {
          if (!!rule.rule[keyRule]) {
            if (isNaN(body[key] as unknown as number)) {
              if (noRule === 0) {
                err_msg[key] = [];
              }
              err_msg[key].push(`${label} is not a number.`);
              noRule++;
              error++;
            }
          }
        } else {
          continue;
        }
      }
    }
    return {
      fails: function () {
        if (error > 0) {
          return true;
        } else {
          return false;
        }
      },
      getMessages: function () {
        return err_msg;
      },
    };
  },
};

export default Validator;
