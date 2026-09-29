#!/usr/bin/env python3
"""
============================================================================
CORPORACIÓN E INNOVACIÓN GUERRA (CIG) - DEPORVERSO
MÓDULO: AutoHighlightGenerator (9:16 Vertical Video Engine)
============================================================================
Propósito:
  1. Extracción determinista de clips de goles y jugadas polémicas de VAR.
  2. Transformación cinemática a formato vertical 9:16 (1080x1920 px).
  3. Integración con Visión Artificial Edge AI y VAR A la Carta.
============================================================================
"""

import os
import sys
import argparse
import json
import subprocess
import time

class AutoHighlightGenerator:
    def __init__(self, ffmpeg_bin="ffmpeg"):
        self.ffmpeg_bin = ffmpeg_bin

    def generate_goal_clip_916(self, input_video_path, event_timestamp_sec, output_clip_path, pre_sec=10.0, post_sec=5.0):
        """
        Extrae un clip de gol o jugada VAR y lo transforma a formato vertical 9:16.
        
        :param input_video_path: Ruta o URL del archivo MP4 completo del partido.
        :param event_timestamp_sec: Segundo exacto donde ocurrió el evento (ej. 850.5).
        :param output_clip_path: Ruta del archivo MP4 de salida.
        :param pre_sec: Segundos a capturar antes del evento (default: 10.0).
        :param post_sec: Segundos a capturar después del evento (default: 5.0).
        """
        start_time = max(0.0, float(event_timestamp_sec) - float(pre_sec))
        duration = float(pre_sec) + float(post_sec)  # 15.0 segundos por defecto

        # Asegurar directorio de salida
        output_dir = os.path.dirname(os.path.abspath(output_clip_path))
        if output_dir and not os.path.exists(output_dir):
            os.makedirs(output_dir, exist_ok=True)

        # Filtro de video FFmpeg:
        # 1. Recorta horizontalmente al ratio 9:16 manteniendo la altura total.
        # 2. Escala la resolución resultante a 1080x1920 px (calidad Full HD Vertical).
        vf_filter = "crop=ih*(9/16):ih:(iw-ow)/2:0,scale=1080:1920:flags=bicubic"

        cmd = [
            self.ffmpeg_bin,
            "-y",  # Sobrescribir si existe
            "-ss", str(start_time),
            "-i", input_video_path,
            "-t", str(duration),
            "-vf", vf_filter,
            "-c:v", "libx264",
            "-preset", "veryfast",
            "-crf", "22",
            "-c:a", "aac",
            "-b:a", "128k",
            output_clip_path
        ]

        try:
            start_proc = time.time()
            res = subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            elapsed = time.time() - start_proc
            return {
                "success": True,
                "elapsed_sec": round(elapsed, 2),
                "start_time_sec": start_time,
                "duration_sec": duration,
                "output_path": output_clip_path,
                "aspect_ratio": "9:16",
                "resolution": "1080x1920"
            }
        except subprocess.CalledProcessError as e:
            err_msg = e.stderr.decode("utf-8", errors="ignore")
            print(f"[AutoHighlightGenerator Error]: {err_msg}", file=sys.stderr)
            return {
                "success": False,
                "error": err_msg,
                "output_path": output_clip_path
            }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="DeporVerso AutoHighlightGenerator CLI")
    parser.add_argument("--input", required=True, help="Ruta local o URL HTTP del video del partido")
    parser.add_argument("--timestamp", type=float, required=True, help="Segundo del gol o incidencia VAR")
    parser.add_argument("--output", required=True, help="Ruta de destino del clip .mp4")
    parser.add_argument("--pre", type=float, default=10.0, help="Segundos antes de la incidencia (default: 10)")
    parser.add_argument("--post", type=float, default=5.0, help="Segundos después de la incidencia (default: 5)")
    parser.add_argument("--ffmpeg", default="ffmpeg", help="Ruta al binario de FFmpeg")

    args = parser.parse_args()

    generator = AutoHighlightGenerator(ffmpeg_bin=args.ffmpeg)
    result = generator.generate_goal_clip_916(
        input_video_path=args.input,
        event_timestamp_sec=args.timestamp,
        output_clip_path=args.output,
        pre_sec=args.pre,
        post_sec=args.post
    )

    print(json.dumps(result))
    sys.exit(0 if result.get("success") else 1)
