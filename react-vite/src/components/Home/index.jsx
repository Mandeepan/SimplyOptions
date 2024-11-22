import { useSelector } from "react-redux";
import HomePageBeforeLogin from "./HomePageBeforeLogin";

export default function Home() {
    const sessionUser = useSelector((state) => state.session.user);
    // const data = useLoaderData();

    // if (!data.tweets) {
    //     return <h1>Loading...</h1>;
    // }

    return (
        <>{sessionUser? 
            <h1>Welcome to SimplyOptions!</h1> 
            : 
            <HomePageBeforeLogin />
        }
        </>
    );
}
