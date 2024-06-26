import { Authorized, Query, Resolver, Mutation, Arg } from "type-graphql";
import BookService from "../services/book.service";
import Book, { InputCreateBook } from "../entities/book.entity";
import { MyContext } from "..";

@Resolver()
export default class BookResolver {
  @Authorized(["MANAGER"])
  @Query(() => [Book])
  async books() {
    return await new BookService().listBooks();
  }

  @Mutation(() => Book)
  async createBook(@Arg("infos") infos: InputCreateBook) {
    const newBook = await new BookService().createBook(infos);
    return newBook;
  }
}
