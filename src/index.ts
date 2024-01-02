import Application from "../library/application";
import parseJson from "../library/parsers/parseJson";
import parseUrl from "../library/parsers/parseUrl";
import { errorMiddleware } from "./middleware/errorMiddleware";
import authRouter from './routers/authRouter';

const PORT = +process.env.PORT || 5000;

const app = new Application();

app.use(parseJson);
app.use(parseUrl('http://localhost:5000'));
app.use(errorMiddleware);

app.addRouter(authRouter);


const start = () => {
    app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))
};

start();