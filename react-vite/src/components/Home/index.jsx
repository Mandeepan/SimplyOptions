import { useSelector } from "react-redux";
import HomePageBeforeLogin from "./HomePageBeforeLogin";
import HomePageAfterLogin from "./HomePageAfterLogin";

export default function Home() {
    const sessionUser = useSelector((state) => state.session.user);
    // const data = useLoaderData();

    // if (!data.tweets) {
    //     return <h1>Loading...</h1>;
    // }

    return (
        <>{sessionUser? 
            <HomePageAfterLogin />
            : 
            <HomePageBeforeLogin />
        }
        </>
    );
}
