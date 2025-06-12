'use server';

import { BOILER_CONT, webApiURL, USER_PASS } from "./constants";

const myHeaders = new Headers();
myHeaders.append("Authorization", "Basic "+ USER_PASS);
myHeaders.append('Content-Type', 'application/json')


export async function pushToBoilerCont (data: any[]) {
    const raw = JSON.stringify([
      data
    ]);
    
    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
      body: raw
    };
  
    const url = webApiURL + "/containers/" + BOILER_CONT + "/rows";
  //  console.log("running server action" + url)
    try {
      const resp = await fetch (url, requestOptions)
      console.log(resp.statusText);
      console.log(resp.status);
      const json = await resp.json();
      console.log(json);
    } catch (error) {
      console.log("Error fetching read container: ", error);
    }
  }
  

  export async function readContainer (containerName: string, limit: number, pastHour: boolean) {

    let condition = ""
    if (pastHour) {
      condition = "ts < TIMESTAMPADD(HOUR, NOW(), -1)"
    }

    const raw = JSON.stringify({
      "offset": 0,
      "sort": "ts desc",
      limit,
      condition
    });
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
      body: raw
    };
  
    const url = webApiURL + "/containers/" + containerName + "/rows";
    try {
      const resp = await fetch (url, requestOptions)
    //  console.log(resp.statusText);
   //   console.log(resp.status);
      const json = await resp.json();
      return json;
    } catch (error) {
      console.log("Error fetching read container: ", error);
    }
  }