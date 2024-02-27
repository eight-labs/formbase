import { ipAddress } from "@vercel/edge";

import { env } from "~/env";

const API_REQUEST_URL = `https://api.findip.net/ipHere/?token=${env.IP_GEOLOCATION_API_KEY}`;

export const getCountryFromIp = async (req: Request): Promise<string> => {
  let incomingClientIp: string | undefined;

  if (env.NODE_ENV === "production") {
    incomingClientIp = ipAddress(req);
  } else {
    incomingClientIp =
      req.headers.get("x-real-ip") ??
      req.headers.get("x-forwarded-for") ??
      undefined;
  }

  if (!incomingClientIp) {
    return "Unknown";
  }

  try {
    const response = await fetch(
      API_REQUEST_URL.replace("ipHere", incomingClientIp),
    );

    if (!response.ok) {
      // throw new Error("Failed to fetch IP geolocation data");
      // ? if we throw an error here, will it affect the insertion of the form data?
      return "Unknown";
    }

    const responseData: GeolocationAPIResponseType = await response.json();

    return responseData.country.names.en;
  } catch (error) {
    // ? what to do here?
  }

  return "Unknown";
};

type GeolocationAPIResponseType = {
  city: {
    geoname_id: number;
    names: {
      en: string;
    };
  };
  continent: {
    code: string;
    geoname_id: number;
    names: {
      de: string;
      en: string;
      es: string;
      fa: string;
      fr: string;
      ja: string;
      ko: string;
      "pt-BR": string;
      ru: string;
      "zh-CN": string;
    };
  };
  country: {
    geoname_id: number;
    is_in_european_union: boolean;
    iso_code: string;
    names: {
      de: string;
      en: string;
      es: string;
      fa: string;
      fr: string;
      ja: string;
      ko: string;
      "pt-BR": string;
      ru: string;
      "zh-CN": string;
    };
  };
  location: {
    latitude: number;
    longitude: number;
    time_zone: string;
    weather_code: string;
  };
  subdivisions: Array<{
    geoname_id: number;
    iso_code?: string;
    names: {
      en: string;
      ko?: string;
    };
  }>;
  traits: {
    autonomous_system_number: number;
    autonomous_system_organization: string;
    connection_type: string;
    isp: string;
    organization: string;
    user_type: string;
  };
};
