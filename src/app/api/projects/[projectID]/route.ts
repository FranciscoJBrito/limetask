import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

interface Params {
  params: { projectID: string };
}

//Función para obtener un proyecto
export async function GET(request: Request, { params }: Params) {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: Number(params.projectID),
      },
      include: {
        colums: true,
      },
    });
    return NextResponse.json(project);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 500,
        }
      );
    }
  }
}

//Función para actualizar un proyecto
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { title } = await request.json();
    const editedProject = await prisma.project.update({
      data: {
        title,
      },
      where: {
        id: Number(params.projectID),
      },
    });
    return NextResponse.json(editedProject);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 500,
        }
      );
    }
  }
}



/* export async function PUT(request: Request,{ params}: Params) {
  try {
    const colums = await request.json();
    const updatedColums = await prisma.project.update({
      where: {
        id: Number(params.projectID)
      },
      data: {
        colums,
      }
    });
    return NextResponse.json(updatedColums);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 500,
        }
      );
    }
  }
} */






//Función para eliminar un proyecto
export async function DELETE(request: Request, { params }: Params) {
  try {
    await prisma.colum.deleteMany({
      where: {
        projectID: Number(params.projectID)
      }
    })
    const deletedProject = await prisma.project.delete({
      where: {
        id: Number(params.projectID),
      },
    });
    return NextResponse.json(deletedProject);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 500,
        }
      );
    }
  }
}
