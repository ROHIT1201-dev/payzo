import { Button } from "./button";
import Image from "next/image";

interface AppbarProps {
  user?: {
    name?: string | null;
  };

  onSignin: any;
  onSignout: any;
}

export const Appbar = ({ user, onSignin, onSignout }: AppbarProps) => {
  return (
    <div className="flex justify-between border-b px-4  shadow-md">
      <div className="text-lg flex items-center justify-center font-semibold">
        <div>
          <Image
            src="/images/payzo-logo.png"
            alt="Profile Picture"
            width={20}
            height={20}
          />
        </div>
        <div className="text-[#040711] font-b">PayZO</div>
      </div>
      <div className="flex flex-col justify-center pt-2">
        <Button onClick={user ? onSignout : onSignin}>
          {user ? "Logout" : "Login"}
        </Button>
      </div>
    </div>
  );
};
