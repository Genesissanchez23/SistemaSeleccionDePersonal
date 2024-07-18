import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// Domain
import { PostulacionModel } from '@domain/models/postulacion/postulacion.model';

// Infrastructura
import { Blocks, Cuestionario, Questions } from '@infrastructure/repositories/custionarios/entities/cuestionario-uno-bloque-uno';

@Component({
  selector: 'app-postulacion-cuestionario',
  standalone: true,
  imports: [],
  templateUrl: './postulacion-cuestionario.component.html',
  styleUrl: './postulacion-cuestionario.component.css'
})
export class PostulacionCuestionarioComponent implements OnInit {

  public cuestionario!: Cuestionario

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PostulacionModel,
  ) { }

  ngOnInit(): void {
    this.cuestionario = this.transformJsonToCuestionario(this.data.formularioEntrevista!)
  }

  transformJsonToCuestionario(jsonString: string): Cuestionario {
    let jsonData: any;
    try {
      jsonData = JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return {
        title: '',
        blocks: []
      };
    }

    if (!Array.isArray(jsonData.blocks)) {
      console.error('Invalid JSON data structure: jsonData.blocks is not an array');
      return {
        title: '',
        blocks: []
      };
    }

    const blocks: Blocks[] = [];
    jsonData.blocks.forEach((block: any) => {
      if (!Array.isArray(block.questions)) {
        console.error('Invalid JSON data structure: block.questions is not an array');
        return;
      }

      const questions: Questions[] = block.questions.map((question: any) => ({
        question: question.question || '',
        options: question.options || []
      }));

      blocks.push({
        title: block.title || '',
        questions
      });
    });

    const cuestionario: Cuestionario = {
      title: jsonData.title || '',
      blocks
    };
    return cuestionario;
  }

  descargarTxt() {
    const txtContent = this.generateTxtContent(this.cuestionario);
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cuestionario.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  generateTxtContent(cuestionario: Cuestionario): string {
    let content = `Cuestionario: ${cuestionario.title}\n\n`;

    cuestionario.blocks.forEach((block, blockIndex) => {
      content += `Bloque ${blockIndex + 1}: ${block.title}\n\n`;

      block.questions.forEach((question, questionIndex) => {
        content += `${questionIndex + 1}) ${question.question}\n`;
        question.options.forEach((option, optionIndex) => {
          content += `  ${optionIndex + 1}. ${option}\n`;
        });
        content += '\n';
      });
      content += '\n';
    });

    return content;
  }


}
