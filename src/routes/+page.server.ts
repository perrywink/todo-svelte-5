import { db } from "$lib/db";
import { todos } from "$lib/db/schema.js";
import { fail } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { createSchema, deleteSchema, updateSchema } from "$lib/form-schemas.js";

export const load = async ({ depends }) => {
  depends("app:todos");
  const createForm = await superValidate(zod(createSchema));
  const updateForm = await superValidate(zod(updateSchema));
  const deleteForm = await superValidate(zod(deleteSchema));

  const fetchTodos = async () => await db.select().from(todos).limit(10);

  return {
    forms: {
      createForm,
      updateForm,
      deleteForm
    },
    todos: await fetchTodos(),
  };
};

export const actions = {
  create: async ({ request }) => {
    const form = await superValidate(request, zod(createSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      await db.insert(todos).values({
        description: form.data.description,
        completed: false,
      });
    } catch (error) {
      return message(form, "Unable to create todo!");
    }

    return message(form, "Todo created!");
  },

  update: async ({ request }) => {
    const form = await superValidate(request, zod(updateSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      await db
        .update(todos)
        .set({
          description: form.data.description,
          completed: form.data.completed
        })
        .where(eq(todos.id, form.data.id));
    } catch (error) {
      return message(form, "Unable to update todo!");
    }

    return message(form, "Todo updated!");
  },
  
  delete: async ({request}) => {
    const form = await superValidate(request, zod(deleteSchema))

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      await db.delete(todos).where(
        eq(todos.id, form.data.id)
      )
    } catch (error) {
      return message(form, "Unable to delete todo!")
    }

    return message(form, "Todo deleted!")
  }
};
