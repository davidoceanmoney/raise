import { getCurrentDateTime } from "@/utils/getCurrentDateTime";

const client_sheet = process.env.CLIENT_SHEET;

const base_url =
  "https://graph.microsoft.com/v1.0/drives/b!MOFBCgwOKEm2BMWPgVDn7nLgow40JdBOruf58f99-b3Z5CDVX5J4Tpau1dvYXpPj/items/";
const sheets = [
  "01FATFNHI7NHGWWEPZKBF34UBGILODHZEI", //primary
  "01FATFNHLOX5JYAXE6XJC2ENRCRAGVBMOJ", //secondary
];

type TAddRec = {
  address: string;
  amount: number;
  trxHash: string;
  token: string;
  receiver: string;
  ip: string;
  withdraw: boolean;
  status: number;
};

export const getAccessToken = async () => {
  try {
    const tokenResponse = await fetch(
      `https://login.microsoftonline.com/59c87063-f9e3-4127-bf65-9262327b0d7c/oauth2/v2.0/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: "b7850455-6e67-4f0e-b015-36c042b7cbe6",
          client_secret: client_sheet || "",
          grant_type: "client_credentials",
          scope: "https://graph.microsoft.com/.default",
        }).toString(),
      }
    );

    const data = await tokenResponse.json();

    return data.access_token;
  } catch (error) {
    console.log({ error });
    return null;
  }
};

export const addInTransaction = async ({
  address,
  amount,
  trxHash,
  token,
  receiver,
  ip,
  withdraw,
  status,
}: TAddRec) => {
  const accessToken = await getAccessToken();

  try {
    const dateTime = getCurrentDateTime();

    for (const bookId in sheets) {
      const response = await fetch(
        `${base_url}${bookId}/workbook/worksheets('transactions')/tables('transactions')/rows/add`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            values: [
              [
                dateTime,
                address,
                amount,
                trxHash,
                token,
                receiver,
                ip,
                withdraw,
                status,
              ],
            ],
          }),
        }
      ).then((r) => r.json());
    }

    return true;
  } catch (error) {
    console.log({ error });
    return {
      status: false,
      message: "Something went wrong, please try again!",
    };
  }
};
export const addInWithdraws = async ({
  accessToken,
  trxTime,
  bookId,
  address,
  refHash,
  amount,
}: any) => {
  try {
    const dateTime = getCurrentDateTime();
    const status = "";
    const withdrawalHash = "";
    const comments = "";
    const response = await fetch(
      `${base_url}${bookId}/workbook/worksheets('withdraws')/tables('withdraws')/rows/add`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: [
            [
              dateTime,
              trxTime,
              address,
              refHash,
              amount,
              status,
              withdrawalHash,
              comments,
            ],
          ],
        }),
      }
    ).then((r) => r.json());
    return true;
  } catch (error) {
    console.log({ error });
    return false;
  }
};

export async function findRowByValue({ accessToken, bookId, findBy }: any) {
  try {
    const response = await fetch(
      `${base_url}${bookId}/workbook/worksheets('transactions')/tables('transactions')/rows`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    ).then((r) => r.json());

    const _rows = response.value;
    let rowIndex = -1;
    let rowData;

    for (let rowNum = 0; rowNum < _rows.length; rowNum++) {
      const row = _rows[rowNum];

      const _exists = row?.values?.some((subArray: any[]) =>
        subArray.includes(findBy)
      );
      if (_exists) {
        rowData = row;
        rowIndex = rowNum + 1;
        break;
      }
    }

    if (rowIndex !== -1) {
      return {
        rowIndex,
        rowData: rowData?.values[0] || [],
      };
    } else {
      return {
        rowIndex: null,
        rowData: null,
      };
    }
  } catch (error) {
    console.error("Error fetching rows:", error ? error : error);
    return {
      rowIndex: null,
      rowData: null,
    };
  }
}

async function updateCell({
  rowIndex,
  columnIndex,
  bookId,
  accessToken,
  value,
}: any) {
  const cellAddress = `${columnIndex}${rowIndex + 1}:${columnIndex}${
    rowIndex + 1
  }`;

  const worksheetId = "transactions";

  const updateUrl = `${base_url}${bookId}/workbook/worksheets/${worksheetId}/range(address='${cellAddress}')`;

  try {
    const response = await fetch(updateUrl, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [[value]],
      }),
    });

    const result = await response.json();
  } catch (error) {
    console.error("Error updating cell:", error);
  }
}

export async function updateSheetValue({
  findBy,
  value,
  trxTime,
  address,
  refHash,
  amount,
}: any) {
  const accessToken = await getAccessToken();

  for (const bookId of sheets) {
    try {
      const { rowIndex, rowData } = await findRowByValue({
        accessToken,
        findBy,
        bookId,
      });

      if (!rowIndex) {
        return;
      }

      await updateCell({
        rowIndex: rowIndex,
        columnIndex: "H",
        bookId,
        accessToken,
        value,
      });
    } catch (error) {
      console.log({ error });
    }
  }
  for (const bookId of sheets) {
    try {
      await addInWithdraws({
        accessToken,
        bookId,
        trxTime,
        address,
        refHash,
        amount,
      });
    } catch (error) {
      console.log({ error });
    }
  }
}

export async function isWhitelisted({  address }: {address:string}) {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(
      `${base_url}01FATFNHNSCHTCK2QVBBA2KMEH4QUCPUIK/workbook/worksheets('whitelist')/tables('whitelist')/rows`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    ).then((r) => r.json());

    const _rowsids = response.value;
    console.log(_rowsids[0].values)
    const findByLower = address.toLowerCase();
    
    const recordExists = _rowsids.some((rows:any) => 
      rows.values.some((row:any[]) => row.map(address => address.toLowerCase()).includes(findByLower)
        
      ) 
    );
    return recordExists;
  } catch (error) {
    console.error("Error fetching rows:", error ? error : error);
    return false
  }
}