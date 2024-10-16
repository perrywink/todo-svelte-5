<script lang="ts">
  import type { SuperValidated } from "sveltekit-superforms";
  import { superForm } from "sveltekit-superforms/client";
  import { updateSchema } from "$lib/form-schemas.js";
  import { z } from "zod";
  import { invalidate } from "$app/navigation";
  import Button from "./ui/button/button.svelte";
  import Input from "./ui/input/input.svelte";

  type Props = {
    todo: {
      description: string;
      id: number;
      completed: boolean | null;
    };
    updateForm: SuperValidated<z.infer<typeof updateSchema>>;
  };

  const { todo, updateForm }: Props = $props();

  const { enhance: toggleEnhance } = superForm(updateForm, {
    id: `todo-toggle-${todo.id}`,
    onUpdated: () => {
      invalidate(`app:todos`);
    },
    onSubmit: ({ formData }) => {
			formData.set('id', todo.id.toString());
			formData.set('completed', String(!todo.completed));
    }
  });

  const { form: updateDescForm, enhance: updateEnhance, submit } = superForm(updateForm, {
    id: `todo-update-${todo.id}`,
    resetForm: false,
    onUpdated: () => {
      invalidate(`app:todos`);
    },
    onSubmit: ({ formData }) => {
			formData.set('id', todo.id.toString());
    }
  });


  $updateDescForm.description = todo.description;
</script>

<div class="flex justify-between gap-4 items-center px-4 py-2">
  <Input
    form={`todo-update-${todo.id}`}
    type="text"
    name="description"
    placeholder="Do what?"
    bind:value={$updateDescForm.description}
    class="border-0"
    onfocusout={submit}
  />
  <Button
    form={`todo-toggle-${todo.id}`}
    size="sm"
    variant={todo.completed ? "default" : "outline"}
    type="submit"
  >
    {todo.completed ? "Undo" : "Done"}
  </Button>
</div>

<form
  class="hidden"
  action="?/update"
  method="post"
  use:toggleEnhance
  id={`todo-toggle-${todo.id}`}
></form>

<form
  class="hidden"
  action="?/update"
  method="post"
  use:updateEnhance
  id={`todo-update-${todo.id}`}
></form>

