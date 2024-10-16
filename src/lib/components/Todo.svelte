<script lang="ts">
  import type { SuperValidated } from "sveltekit-superforms";
  import { superForm } from "sveltekit-superforms/client";
  import { deleteSchema, updateSchema } from "$lib/form-schemas.js";
  import { z } from "zod";
  import { invalidate } from "$app/navigation";
  import Button from "./ui/button/button.svelte";
  import Input from "./ui/input/input.svelte";
  import 'iconify-icon'
  import { fly } from 'svelte/transition';

  type Props = {
    todo: {
      description: string;
      id: number;
      completed: boolean | null;
    };
    updateForm: SuperValidated<z.infer<typeof updateSchema>>;
    deleteForm: SuperValidated<z.infer<typeof deleteSchema>>;
  };

  const { todo, updateForm, deleteForm }: Props = $props();

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

  const { form: updateFormData, enhance: updateEnhance, submit: submitUpdate } = superForm(updateForm, {
    id: `todo-update-${todo.id}`,
    resetForm: false,
    onUpdated: () => {
      invalidate(`app:todos`);
    },
    onSubmit: ({ formData }) => {
			formData.set('id', todo.id.toString());
    }
  });

  const { enhance: deleteEnhance } = superForm(deleteForm, {
    id: `todo-delete-${todo.id}`,
    onUpdated: () => {
      invalidate(`app:todos`);
    },
    onSubmit: ({ formData }) => {
			formData.set('id', todo.id.toString());
    }
  });


  $updateFormData.description = todo.description;
</script>

<div class="flex justify-between gap-4 items-center px-4 py-2" transition:fly={{ duration: 150 }}>
  <Input
    form={`todo-update-${todo.id}`}
    type="text"
    name="description"
    placeholder="Do what?"
    bind:value={$updateFormData.description}
    class="border-0"
    onfocusout={submitUpdate}
  />
  <Button
    form={`todo-toggle-${todo.id}`}
    size="sm"
    variant={todo.completed ? "default" : "outline"}
    type="submit"
  >
    {todo.completed ? "Undo" : "Done"}
  </Button>
  <Button
    form={`todo-delete-${todo.id}`}
    size="icon"
    variant="destructive"
    class="px-2"
    type="submit"
  >
    <iconify-icon icon="pixelarticons:trash"></iconify-icon>
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

<form
  class="hidden"
  action="?/delete"
  method="post"
  use:deleteEnhance
  id={`todo-delete-${todo.id}`}
></form>


