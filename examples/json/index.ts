import { GetDataByRID, Log, JSON } from "@w3bstream/wasm-sdk";
export { alloc } from "@w3bstream/wasm-sdk"

export function start(rid: i32): i32 {
    Log("start from typescript");
    const message = GetDataByRID(rid);
    Log("wasm received message:" + message);

    let jsonObj: JSON.Obj = JSON.parse(
        '{"employees":{"employee":[{"id":"1","firstName":"Tom","lastName":"Cruise","photo":"https://jsonformatter.org/img/tom-cruise.jpg"},{"id":"2","firstName":"Maria","lastName":"Sharapova","photo":"https://jsonformatter.org/img/Maria-Sharapova.jpg"},{"id":"3","firstName":"Robert","lastName":"Downey Jr.","photo":"https://jsonformatter.org/img/Robert-Downey-Jr.jpg"}]}}'
    ) as JSON.Obj;

    let employeesOrNull: JSON.Obj | null = jsonObj.getObj("employees");

    if (employeesOrNull != null) {
        let employees: JSON.Obj = employeesOrNull;
        let employeeOrNull: JSON.Arr | null = employees.getArr("employee");
        if (employeeOrNull != null) {
            let employee: JSON.Arr = employeeOrNull;
            let valueOfArray: JSON.Value[] = employee.valueOf();
            for (let i = 0; i < valueOfArray.length; i++) {
                let value: JSON.Value = valueOfArray[i];
                let employeeObj: JSON.Obj = value as JSON.Obj;
                let firstNameOrNull: JSON.Str | null =
                    employeeObj.getString("firstName");
                if (firstNameOrNull != null) {
                    let firstName: string = firstNameOrNull.valueOf();
                    Log("firstName:" + firstName);
                }
                let lastNameOrNull: JSON.Str | null = employeeObj.getString("lastName");
                if (lastNameOrNull != null) {
                    let lastName: string = lastNameOrNull.valueOf();
                    Log("lastName:" + lastName);
                }
                let photoOrNull: JSON.Str | null = employeeObj.getString("photo");
                if (photoOrNull != null) {
                    let photo: string = photoOrNull.valueOf();
                    Log("photo:" + photo);
                }
            }
        }
    }

    return 0;
}
